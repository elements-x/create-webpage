#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const inquirerQuestions = require('./src/inquirer-questions');
const { remotePackageInfo, localPackageInfo } = require('./src/package-info');
const getHTMLFromMarkdown = require('./src/get-html-from-markdown');
const copyDirAndReplace = require('./src/copy-dir-and-replace');
const parseShellCommand = require('./src/parse-shell-command');

const {commands, args} = parseShellCommand(process.argv);
console.log({commands, args});

if ((commands[0] || '').match(/\.md$/)) { // markdown file to html
  (async function() {
    const html = await getHTMLFromMarkdown(process.argv[2]);
    console.log(html);
    return;
  })();
} else {
  run();
}

// test scenario
//  1. test without package.json
//  2. test with package.json
//  3. test witth remote package.json
async function run() {
  const [user, repoName] = commands;
  const pkgInfo = user && repoName ?  await remotePackageInfo(user, repoName) : localPackageInfo() || {};

  // show questions and get answers from user
  const answers = await inquirerQuestions(pkgInfo);
  !answers.base_path.endsWith('/') && (answers.base_path += '/');
  console.log(`* Processing answers ${JSON.stringify(answers, null, '  ')}`);

  // copy files to destination
  fs.rmdirSync(answers.out_dir, { recursive: true, force: true });
  copyDirAndReplace(path.join(__dirname, 'template', answers.template), answers.out_dir, answers);

  // write pages/readme.html from README.md
  const readmePath = user && repoName ?
    `https://raw.githubusercontent.com/${user}/${repoName}/main/README.md` : 
    path.join(process.cwd(), 'README.md');
  const readmeHtmlPath = path.join(answers.out_dir, 'pages', 'readme.html');
  const readmeHtml = await getHTMLFromMarkdown(readmePath);;
  fs.outputFileSync(readmeHtmlPath,  readmeHtml ); 

  console.log(`Done. To open pages run "cd ${answers.out_dir} && npx http-server -o"`);
}