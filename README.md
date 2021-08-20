# genpage
VanillarJS Single Page Web Application Template Generator

Generate a template webpage automatically using your package.json and README.md 

## Usage
```
$ npm i genpage -D
$ npx genpage
$ npx http-server --open ./docs # to see the generated contents
```

## How It Works
1. Read your package.json and README.md
2. Get output directory from user
3. Generate a static web app into the directory

