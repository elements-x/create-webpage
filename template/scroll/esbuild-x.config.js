const glob = require('glob');
const open = require('open');
const rimraf = require('rimraf').sync;
const esbuildX = require('esbuild-x');
const { copy, injectEsbuildResult, runStaticServer, watchAndReload } = esbuildX.postBuilds;

const config = {};
config.build = {
  entryPoints: ['main.js'],
  preBuilds: [ function clear() {rimraf('dist')} ],
  postBuilds: [ 
    copy('{,!(node_modules)/}**/!(*.js) dist'),
    injectEsbuildResult(),
  ]
};

config.serve = {
  entryPoints: ['main.js'],
  postBuilds: [
    copy('./**/!(*.js) dist', {excludes: [/node_modules/]}),
    injectEsbuildResult(),
    runStaticServer('dist'),
    watchAndReload('.'),
    _ => open('http://localhost:9100/')
  ]
};

module.exports = config;
