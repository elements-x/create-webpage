# genpage
Single Page Web Application Template Generator.

Generate an introductory webpage using package.json and README.md

## Usage
```
$ npm i genpage -D
$ npx genpage
$ cd docs && npx http-server -o # to see the generated contents
```

Generated webpage is working as a SPA; Single Page Application. 
You can use it as your github page without any settings or modifiation.

To set your github page with your generated `docs` directory,

1. Goto settings -> pages
2. Select main branch, and set directory as '/docs', then `Save'.
![image](https://user-images.githubusercontent.com/1437734/130330192-81adb6f3-4082-471c-ab69-80c8145592f2.png)


## How It Works
1. Read your package.json and README.md
2. Get output directory from user
3. Generate a static web app into the directory

