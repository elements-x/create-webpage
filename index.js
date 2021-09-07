#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const mustache = require('mustache');
const fetch = require('node-fetch');
const showdown = require('showdown');
const beautify = require('js-beautify');

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
    const pjson = require(path.join(process.cwd(), 'package.json'));
    pjson.html_url = (pjson.repository || pjson.repository.url || '').replace('.git','');
    return pjson;
  }
}

function getAnswers(pkgInfo) {
  const inquirer = require('inquirer');
  const required = val => Promise.resolve(!!val);
  pkgInfo.name = pkgInfo.name || 'unnamed';
  pkgInfo.description = pkgInfo.description || 'Description';
  pkgInfo.html_url = pkgInfo.html_url || `https://github.com/${pkgInfo.name}`;
  pkgInfo.issue_events_url = `${pkgInfo.html_url}/issues`;
  pkgInfo.license = pkgInfo.license || (pkgInfo.license && pkgInfo.license.name) ||  'MIT';

  const questions = [
    {type: 'input', name: 'name', message: 'Project Name', default: pkgInfo.name, validate: required},
    {type: 'input', name: 'out_dir', message: 'Output Directory', default: 'docs', validate: required},
    {type: 'input', name: 'description', message: 'Description', default: pkgInfo.description, validate: required},
    {type: 'input', name: 'version', message: 'Version', default: pkgInfo.version, validate: required},
    {type: 'input', name: 'repo_url', message: 'Repo. URL', default: pkgInfo.html_url, validate: required},
    {type: 'input', name: 'issue_url', message: 'Issue URL', default: pkgInfo.issue_events_url},
    {type: 'input', name: 'template', message: 'Template', default: 'sidebar'},
    {type: 'input', name: 'base_path', message: 'Base Path', default: '/'},
    {type: 'license', name: 'license', message: 'License', default: pkgInfo.license},
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

async function getMarkdownHtml(mdPath) {
  let readmeContents;
  if (mdPath.match(/^http/)) {
    const resp = await fetch(mdPath);
    readmeContents = await resp.text();
  } else {
    readmeContents = fs.readFileSync(mdPath, 'utf8');
  }

  const options = {ghCompatibleHeaderId: true, simpleLineBreaks: true, ghMentions: true, tables: true};
  const converter = new showdown.Converter(options)
  converter.setFlavor('github');
  const html = '<div class="markdown-body animate-x">' + converter.makeHtml(readmeContents) + '</div>';

  return beautify.html(html, {
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 2,
    sep: '\n'
  });
}

async function buildHomeHtml(directory, user, repoName) {
  const destPath = path.join(directory, 'pages', 'home.html');
  const mdPath = user && repoName ? 
    `https://raw.githubusercontent.com/${user}/${repoName}/main/README.md` : path.join(process.cwd(), 'README.md');

  console.log(`* Generating ${destPath} from ${mdPath}`);
  const readmeHtml = await getMarkdownHtml(mdPath);;
  fs.outputFileSync(destPath,  readmeHtml ); 
}

async function run() {
  const mdOrRepo = process.argv[2] ||'';
  if (mdOrRepo.match(/\.md$/)) {
    const html = await getMarkdownHtml(process.argv[2]);
    console.log(html);
  } else {
    const [user, repoName] = mdOrRepo.split('/').slice(-2);
    const pkgInfo = await getPackageInfo(user, repoName);
    console.log(`* Start generating web page for ${pkgInfo.name}`);

    const answers = await getAnswers(pkgInfo);
    console.log(`* Processing answers ${JSON.stringify(answers, null, '  ')}`);

    fs.rmdirSync(answers.out_dir, { recursive: true, force: true });
    copyDir(path.join(__dirname, 'template', answers.template), answers.out_dir, answers);
    await buildHomeHtml(answers.out_dir, user, repoName);
    console.log(`Done. To open pages run "cd ${answers.out_dir} && npx http-server -o"`);
  }
}

run();
