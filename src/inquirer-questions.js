const inquirer = require('inquirer');

async function inquirerQuestions(options = {}) {
  const required = val => Promise.resolve(!!val);

  options.name = options.name || 'my webpage';
  options.description = options.description || 'This is my single page application site.';

  let answers;
  const templateDflt = options.html_url || options.issue_events_url ? 'sidebar' : 'scroll';
  const answers1 = await inquirer.prompt([
      {type: 'input', name: 'name', message: 'Project Name', default: options.name, validate: required},
      {type: 'input', name: 'description', message: 'Description', default: options.description, validate: required},
      {type: 'list', name: 'template', message: 'Choose a Template', default: templateDflt, 
        choices: [
          {value: 'sidebar', name: 'Sidebar - A navigation menu on the left, contents on the right'},
          {value: 'scroll', name: 'Scroll - A long single page template navigation on the right'}
        ]
      },
      {type: 'list', name: 'app_type', message: 'Choose Application Type', default: 'js', 
        choices: [
          {value: 'js', name: 'Javascript Applicatin - main.js + esbuild'},
          {value: 'static', name: 'Static HTML - index.html'}
        ]
      }
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
      {type: 'input', name: 'license', message: 'License', default: options.license},
      {type: 'input', name: 'out_dir', message: 'Output Directory', default: 'docs', validate: required}
    ])
    
    answers = {...answers1, ...answers2};
  } else {
    const answers2 = await inquirer.prompt([
      {
        type: 'input', name: 'out_dir', message: 'Output Directory', 
        default: answers1.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), 
        validate: required
      }
    ]);

    answers = {...answers1, ...answers2};
  }

  return answers;
}

module.exports = inquirerQuestions;