const open = require('open');
const rimraf = require('rimraf').sync;
const esbuildX = require('esbuild-x');
const { copy, injectEsbuildResult, runStaticServer, watchAndReload } = esbuildX.postBuilds;

module.exports = {
  build: {
    entryPoints: ['main.js'],
    preBuilds: [ function clear() {rimraf('dist')} ],
    postBuilds: [ 
      copy('./**/* dist', {excludes: [/node_modules/, /main\.js/, /config\.js/]}),
      injectEsbuildResult(),
    ]
  },
  serve: {
    entryPoints: ['main.js'],
    postBuilds: [
      copy('./**/* dist', {excludes: [/node_modules/, /main\.js/, /config\.js/]}),
      injectEsbuildResult(),
      runStaticServer('dist'),
      watchAndReload('.'),
      _ => open('http://localhost:9100/')
    ]
  }
};

