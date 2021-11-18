# create-webpage
Webpage Generator

Generate an introductory webpage from Q&A, package.json and README.md

## Example
  * https://elements-x.github.io/create-webpage/sidebar
  * https://elements-x.github.io/create-webpage/scroll

## How It Works
1. Get basic information from Q&A
2. Optionally, read your package.json and README.md
3. Generate a static web app into the output directory

## Usage
```
$ npm init webpage
? **Project Name** my webpage 
? **Description** This is my single page application site.
? **Choose a Template** sidebar
> Sidebar - A navigation menu on the left, contents on the right
> Scroll - A long single page template navigation on the right 
? **Choose Appliaction Type** static
> Static HTML - No build required.
> Javascript Applicatin - esbuild required from main.js
? **Output Directory** my-webpage
... processing message ...
```

### To open the generated webpage
If static type, you can see the generated page by opening the output directory with a browser.
```
$ cd my-webpage && npx http-server -o
```

If js type, you can start your app
```
$ cd my-webpage
$ npm i
$ npm start
```

### You can also generate a single file for any markdown file.
```
$ npm init webpage README.md 
$ npm init webpage README.md > docs/pages/readme.html # to update readme.html
```

## To set it as Github pages
Generated html is fully working as a SPA; Single Page Application. 
You can use it as your github page without any settings or modifiation.

To set your github page with your generated `docs` directory,

1. Goto settings -> pages
2. Select main branch, and set directory as '/docs', then `Save'.
![image](https://user-images.githubusercontent.com/1437734/130330192-81adb6f3-4082-471c-ab69-80c8145592f2.png)

