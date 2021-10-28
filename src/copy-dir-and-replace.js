const path = require('path');
const fs = require('fs-extra');
const mustache = require('mustache');

// deep level file processing with callback actions
function copyDirAndReplace(fromDir, toDir, replacements = {}) {
  const walkDir = function(dir, callback) {
    fs.readdirSync(dir).forEach( file => {
      let dirPath = path.join(dir, file);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ?  walkDir(dirPath, callback) : callback(path.join(dir, file));
    });
  };
 
  console.log(`* Copying directory ${fromDir} to ${toDir} with replacements`);
  walkDir(fromDir, file => {
    const fileContents = fs.readFileSync(file, 'utf8');
    const outputPath = path.join(toDir, file.replace(fromDir, ''));
    let outputContents = fileContents;
    if (file.match(/\.(html|json|txt|css)$/)) {
      try {
        outputContents = mustache.render(fileContents, replacements);
      } catch (e) {
        // console.error(e);
      }
    }
    fs.outputFileSync(outputPath, outputContents);
  });
}

module.exports = copyDirAndReplace;
