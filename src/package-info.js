const fs = require('fs-extra');
const fetch = require('node-fetch');
const path = require('path');

async function remotePackageInfo(user, repoName) {
  const gitApiUrl = `https://api.github.com/repos/${user}/${repoName}`;
  const resp = await fetch(gitApiUrl);
  if (resp.ok) {
    return resp.json();
  } else {
    throw `Error: Invalid git repo, ${gitApiUrl}`;
  }
}

async function localPackageInfo() {
  if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    const pjson = require(path.join(process.cwd(), 'package.json'));
    pjson.html_url = (pjson.repository || pjson.repository.url || '').replace('.git','');
    return pjson;
  } else {
    return undefined;
  }
}

module.exports = {
  remotePackageInfo, localPackageInfo
}
