const glob = require('glob');
const { rimraf } = require('bojagi/lib/util');

const { copy, injectBuild, runWebsocketServer, runStaticServer, watchAndReload } = require('bojagi/post-builds');

const config = {};
config.build = {
  entryPoints: ['main.js'],
  preBuilds: [ function clear() {rimraf('dist')} ], 
  postBuilds: [ copy('assets pages *.html *.txt dist'), injectBuild ]
};

config.serve = {
  entryPoints: ['main.js'],
  notFoundHandler: {'^/': 'index.html'},
  postBuilds: [ 
    copy('assets pages *.html *.txt dist'),
    injectBuild,
    runStaticServer,
    runWebsocketServer,
    watchAndReload(['src', 'lib'])
  ]
};

module.exports = config;
