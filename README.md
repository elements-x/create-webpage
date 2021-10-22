# genpage
Single Page Web Application Template Generator.

Generate an introductory webpage using package.json and README.md

## Example
  * https://elements-x.github.io/touch-x/
  * https://elements-x.github.io/genpage/

## Usage
```
$ npm i genpage -D
$ npx genpage
* Start generating web page for genpage
? Project Name genpage
? Output Directory docs
? Description VanillarJS Single Page Web Application Template Generator
? Version 0.2.0
? Repo. URL https://github.com/elements-x/genpage
? Issue URL https://github.com/elements-x/genpage/issues
? License MIT
... processing message ...
```

To see the generated page
```
$ cd docs && npx http-server -o
```

You can also generate a single file for any markdown file.
```
$ npx genpage README.md 
$ npx genpage README.md > docs/pages/readme.html # to update readme.html
```

## To set it as Github pages
Generated webpage is fully working as a SPA; Single Page Application. 
You can use it as your github page without any settings or modifiation.

To set your github page with your generated `docs` directory,

1. Goto settings -> pages
2. Select main branch, and set directory as '/docs', then `Save'.
![image](https://user-images.githubusercontent.com/1437734/130330192-81adb6f3-4082-471c-ab69-80c8145592f2.png)


## How It Works
1. Read your package.json and README.md
2. Get output directory from user
3. Generate a static web app into the output directory(default `docs`)

