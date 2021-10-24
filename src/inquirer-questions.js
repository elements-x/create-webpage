const inquirer = require('inquirer');

async function inquirerQuestions(options = {}) {
  const required = val => Promise.resolve(!!val);

  options.name = options.name || 'my-webpage';
  options.description = options.description || 'This is my single page application site.';

  let answers;
  const answers1 = await inquirer.prompt([
      {type: 'input', name: 'name', message: 'Project Name', default: options.name, validate: required},
      {type: 'input', name: 'description', message: 'Description', default: options.description, validate: required},
      {type: 'input', name: 'template', message: 'Template', default: 'sidebar'}
    ]);
  
  // this only applies to if build is for NodeJS package
  if (options.html_url || options.issue_events_url) {
    options.html_url = options.html_url || `https://github.com/${options.name}`;
    options.issue_events_url = `${options.html_url}/issues`;
    options.license = options.license || (options.license && options.license.name) ||  'MIT';

    const answers2 = await inquirer.prompt([
      {type: 'input', name: 'version', message: 'Version', default: options.version, validate: required},
      {type: 'input', name: 'repo_url', message: 'Repo. URL', default: options.html_url, validate: required},
      {type: 'input', name: 'issue_url', message: 'Issue URL', default: options.issue_events_url},
      {type: 'license', name: 'license', message: 'License', default: options.license},
      {type: 'input', name: 'out_dir', message: 'Output Directory', default: 'docs', validate: required},
      {type: 'input', name: 'base_path', message: 'Base Path', default: '/'},
    ])
    
    answers = {...answers1, ...answers2};
  } else {
    console.log({answers1})
    const answers2 = await inquirer.prompt([
      {type: 'input', name: 'out_dir', message: 'Output Directory', 
        default: answers1.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), validate: required},
      {type: 'input', name: 'base_path', message: 'Base Path', default: '/'},
    ]);

    answers = {...answers1, ...answers2};
  }

  return answers;
}

module.exports = inquirerQuestions;