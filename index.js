#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');

const inquirerQuestions = require(path.join(__dirname, 'src/inquirer-questions'));
const { remotePackageInfo, localPackageInfo } = require(path.join(__dirname, 'src/package-info'));
const getHTMLFromMarkdown = require(path.join(__dirname, 'src/get-html-from-markdown'));
const copyDirAndReplace = require(path.join(__dirname, 'src/copy-dir-and-replace'));
const parseShellCommand = require(path.join(__dirname, 'src/parse-shell-command'));

const {commands, args} = parseShellCommand(process.argv);

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
  const readmePath = 
    user && repoName ? `https://raw.githubusercontent.com/${user}/${repoName}/main/README.md` : 
    fs.existsSync(path.join(answers.out_dir, 'README.md')) ? path.join(answers.out_dir, 'README.md') :
    null;
  if (readmePath) {
    const readmeHtmlPath = path.join(answers.out_dir, 'pages', 'readme.html');
    const readmeHtml = await getHTMLFromMarkdown(readmePath);;
    fs.outputFileSync(readmeHtmlPath,  readmeHtml ); 
  }

  require('child_process').exec('npx http-server -p 8080 -c-1 -o', {cwd: answers.out_dir});
  console.log(`Your website is running on http://localhost:8080.`);
  console.log(`CTRL-C to exit. Run the following to run a local http server.`);
  console.log(`$ cd ${answers.out_dir}`);
  console.log(`$ npm i`);
  console.log(`$ npx http-server -o`);
  process.exit(0);
}