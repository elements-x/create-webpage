# create-webpage
`npm init webpage`, a web page generator.

Generate a webpage, also using package.json and README.md

## Example
  * https://elements-x.github.io/create-webpage/sidebar
  * https://elements-x.github.io/create-webpage/scroll
  
## Usage
```
$  npm init webpage
? Project Name my-webpage
? Description This is my single page application site.
? Template sidebar
? Output Directory my-webpage
? Base Path /
* Processing answers  ...
```

## Usage for git repo.
```
$ npm init webpage
? Project Name create-webpage
? Description VanillarJS Single Page Web Application Template Generator
? Choose a Template Sidebar - A navigation menu on the left, contents on the right
? Version 0.2.9
? Repo. URL https://github.com/elements-x/genpage
? Issue URL https://github.com/elements-x/genpage/issues
? License MIT
? Output Directory docs/sidebar
? Base Path /
* Processing answers  .... 
```

You can also generate a single file from a markdown file.
```
$ npm init webpage README.md 
```

## To set it as Github pages
A generated webpage is fully working as a SPA; Single Page Application. 
You can use it as your github page without any settings or modifiation.

To set your github page with your generated `docs` directory,

1. Goto settings -> pages
2. Select main branch, and set directory as '/docs', then `Save'.
![image](https://user-images.githubusercontent.com/1437734/130330192-81adb6f3-4082-471c-ab69-80c8145592f2.png)


## How It Works
1. Read your package.json and README.md
2. Get output directory from user
3. Generate a static web app into the output directory(default `docs`)

