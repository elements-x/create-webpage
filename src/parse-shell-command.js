
// parse cli command and args
function parseShellCommand() {
  const yargs = require('yargs/yargs')
  const { hideBin } = require('yargs/helpers')
  const argv = yargs(hideBin(process.argv)).argv
  const commands =  argv._ || [];
  const args = Object.assign({}, argv);
  delete args._;
  delete args.$0;

  return {commands, args};
}

module.exports = parseShellCommand;
