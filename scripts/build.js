#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_PAGES = path.join(ROOT, 'src', 'pages');
const PARTIALS = path.join(ROOT, 'src', 'partials');
const DIST = path.join(ROOT, 'dist');
const STATIC_DIRS = ['css', 'js', 'img'];
const STATIC_FILES = ['.nojekyll'];

function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS, `${name}.html`), 'utf8');
}

function renderNav(pageKey) {
  return readPartial('nav')
    .replace(/\{\{active:(\w+)\}\}/g, (_, key) => (key === pageKey ? 'active' : ''))
    .replace(/ class=""/g, '');
}

function buildPage(file) {
  const pageKey = path.basename(file, '.html');
  let html = fs.readFileSync(path.join(SRC_PAGES, file), 'utf8');

  html = html
    .replace(/<!--#include:head-->/g, readPartial('head'))
    .replace(/<!--#include:nav-->/g, renderNav(pageKey))
    .replace(/<!--#include:footer-->/g, readPartial('footer'));

  fs.writeFileSync(path.join(DIST, file), html);
}

function copyStaticAssets() {
  for (const dir of STATIC_DIRS) {
    const src = path.join(ROOT, dir);
    if (fs.existsSync(src)) {
      fs.cpSync(src, path.join(DIST, dir), { recursive: true });
    }
  }
  for (const file of STATIC_FILES) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, file));
    }
  }
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const pages = fs.readdirSync(SRC_PAGES).filter((f) => f.endsWith('.html'));
  for (const page of pages) {
    buildPage(page);
  }
  copyStaticAssets();

  console.log(`Built ${pages.length} pages to dist/`);
}

main();
