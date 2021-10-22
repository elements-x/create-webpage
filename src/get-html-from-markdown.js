const fs = require('fs-extra');
const fetch = require('node-fetch');
const showdown = require('showdown');
const beautify = require('js-beautify');

async function getHTMLFromMarkdown(mdPath) {
  let readmeContents;
  if (mdPath.match(/^http/)) {
    const resp = await fetch(mdPath);
    readmeContents = await resp.text();
  } else {
    readmeContents = fs.readFileSync(mdPath, 'utf8');
  }

  const options = {ghCompatibleHeaderId: true, simpleLineBreaks: true, ghMentions: true, tables: true};
  const converter = new showdown.Converter(options)
  converter.setFlavor('github');
  const html = '<div class="markdown-body animate-x">' + converter.makeHtml(readmeContents) + '</div>';

  return beautify.html(html, {
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 2,
    sep: '\n'
  });
}

module.exports = getHTMLFromMarkdown;