#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const mustache = require('mustache');
const fetch = require('node-fetch');

async function getPackageInfo(user, repoName) {
  if (user && repoName) { // get it from github api
    const gitApiUrl = `https://api.github.com/repos/${user}/${repoName}`;
    const resp = await fetch(gitApiUrl);
    if (resp.ok) {
      return resp.json();
    } else {
      throw `Error: Invalid git repo, ${gitApiUrl}`;
    }
  } else { // get it from package.json
    const pjson = require('./package.json');
    pjson.html_url = (pjson.repository || {}).url;
    pjson.issue_events_url = (pjson.bugs || {}).url;
    return pjson;
  }
}

function getAnswers(pkgInfo) {
  const inquirer = require('inquirer');
  const required = val => Promise.resolve(!!val);
  pkgInfo.name = pkgInfo.name || 'unnamed';
  pkgInfo.description = pkgInfo.name || 'Description';
  pkgInfo.html_url = pkgInfo.html_url || `https://github.com/${pkgInfo.name}`;
  pkgInfo.issue_events_url = pkgInfo.issue_events_url || `https://github.com/${pkgInfo.name}/issues`;

  const questions = [
    {type: 'input', name: 'name', message: 'Project Name', default: pkgInfo.name, validate: required},
    {type: 'input', name: 'outDir', message: 'Output Directory', default: 'docs', validate: required},
    {type: 'input', name: 'description', message: 'Description', default: pkgInfo.description, validate: required},
    {type: 'input', name: 'version', message: 'Version', default: pkgInfo.version, validate: required},
    {type: 'input', name: 'repo_url', message: 'Repo. URL', default: pkgInfo.html_url, validate: required},
    {type: 'input', name: 'issue_url', message: 'Issue URL', default: pkgInfo.issue_events_url},
    {type: 'license', name: 'license', message: 'License', default: pkgInfo.license || 'MIT'},
  ];

  return inquirer.prompt(questions);
}

// deep level file processing with callback actions
function copyDir(fromDir, toDir, replacements) {
  const walkDir = function(dir, callback) {
    fs.readdirSync(dir).forEach( file => {
      let dirPath = path.join(dir, file);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ?  walkDir(dirPath, callback) : callback(path.join(dir, file));
    });
  };
 
  console.log(`* Copying directory ${fromDir} to ${toDir} with replacements`);
  console.log('  ', {replacements});
  walkDir(fromDir, file => {
    const fileContents = fs.readFileSync(file, 'utf8');
    const outputPath = path.join(toDir, file.replace(fromDir, ''));
    let outputContents = fileContents;
    console.log('  Processing file', file, 'to', outputPath);
    try {
      outputContents = mustache.render(fileContents, replacements);
    } catch (e) {
      console.error(e);
    }
    fs.outputFileSync(outputPath, outputContents);
  });
}

async function run() {
  const [user, repoName] = (process.argv[2]||'').split('/').slice(-2);
  const pkgInfo = await getPackageInfo(user, repoName);
  console.log(`* Start generating web page for ${pkgInfo.name}`);

  const answers = await getAnswers(pkgInfo);
  console.log(`* Processing answers ${JSON.stringify(answers, null, '  ')}`);

  copyDir(path.join(__dirname, 'template'), answers.outDir, answers);
  console.log(`Done. To open pages run "cd ${answers.outDir} && npx http-server -o ${answers.outDir}"`);
}

run();
