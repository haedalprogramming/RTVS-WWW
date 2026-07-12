#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_PAGES = path.join(ROOT, 'src', 'pages');
const PARTIALS = path.join(ROOT, 'src', 'partials');
const DIST = path.join(ROOT, 'dist');
const STATIC_DIRS = ['css', 'js', 'img'];
const STATIC_FILES = ['.nojekyll', 'robots.txt', 'sitemap.xml'];

const SEO = require('./seo.js');
const T = require('../js/i18n-data.js');

const LANGS = ['ko', 'en'];

function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS, `${name}.html`), 'utf8');
}

function escAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function pageFileFor(pageKey) {
  return pageKey === 'index' ? 'index.html' : `${pageKey}.html`;
}

function renderMeta(pageKey, lang) {
  const page = SEO.PAGES[pageKey];
  const meta = page[lang];
  const koUrl = `${SEO.SITE_URL}/${page.path}`;
  const enUrl = `${SEO.SITE_URL}/en/${page.path}`;
  const canonicalUrl = lang === 'en' ? enUrl : koUrl;
  const locale = lang === 'en' ? 'en_US' : 'ko_KR';
  const altLocale = lang === 'en' ? 'ko_KR' : 'en_US';
  const ogTitle = meta.ogTitle || meta.title;
  const ogDescription = meta.ogDescription || meta.description;

  return `  <title>${escAttr(meta.title)}</title>
  <meta name="description" content="${escAttr(meta.description)}" />
  <meta name="keywords" content="${escAttr(meta.keywords)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="ko" href="${koUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="x-default" href="${koUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escAttr(SEO.SITE_NAME)}" />
  <meta property="og:title" content="${escAttr(ogTitle)}" />
  <meta property="og:description" content="${escAttr(ogDescription)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${SEO.OG_IMAGE}" />
  <meta property="og:image:width" content="${SEO.OG_IMAGE_WIDTH}" />
  <meta property="og:image:height" content="${SEO.OG_IMAGE_HEIGHT}" />
  <meta property="og:locale" content="${locale}" />
  <meta property="og:locale:alternate" content="${altLocale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escAttr(ogTitle)}" />
  <meta name="twitter:description" content="${escAttr(ogDescription)}" />
  <meta name="twitter:image" content="${SEO.OG_IMAGE}" />`;
}

function renderJsonLd(lang) {
  const orgDescription =
    lang === 'en'
      ? 'The team behind Code Builder, a Roblox coding game'
      : '로블록스 코딩 게임 Code Builder를 만드는 팀';

  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Code Builder",
    "url": "https://roblox.code-builder.kr/",
    "logo": "https://roblox.code-builder.kr/img/apple-touch-icon.png",
    "description": "${orgDescription}"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Code Builder",
    "url": "https://roblox.code-builder.kr/",
    "inLanguage": ["ko", "en"]
  }
  </script>`;
}

function renderLangSwitch(pageKey, lang) {
  const koHref = `/${pageFileFor(pageKey)}`;
  if (lang === 'en') {
    return `      <a class="lang-btn" href="${koHref}" data-lang="ko" onclick="localStorage.setItem('cb-lang','ko')">KO</a>
      <span class="lang-btn active" data-lang="en" style="cursor:default">EN</span>`;
  }
  return `      <button class="lang-btn" data-lang="ko" onclick="setLang('ko')">KO</button>
      <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>`;
}

function renderNav(pageKey, lang) {
  return readPartial('nav')
    .replace(/\{\{active:([\w-]+)\}\}/g, (_, key) => (key === pageKey ? 'active' : ''))
    .replace(/ class=""/g, '')
    .replace('<!--#langswitch-->', renderLangSwitch(pageKey, lang));
}

// Replaces the inner HTML of every element carrying a data-i18n="key"
// attribute with the matching translation, mirroring what setLang() does
// client-side — but at build time, so /en/ pages ship real English HTML.
function localizeText(html, dict) {
  const startTagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\bdata-i18n="([\w-]+)"[^>]*>/g;
  let result = '';
  let cursor = 0;
  let match;

  while ((match = startTagRe.exec(html)) !== null) {
    const [openTag, tagName, key] = match;
    const openStart = match.index;
    const openEnd = openStart + openTag.length;

    const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
    const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
    let depth = 1;
    let pos = openEnd;
    let closeStart = -1;
    let closeEnd = -1;

    while (depth > 0) {
      openRe.lastIndex = pos;
      closeRe.lastIndex = pos;
      const nextOpen = openRe.exec(html);
      const nextClose = closeRe.exec(html);
      if (!nextClose) {
        throw new Error(`Unmatched <${tagName}> for data-i18n="${key}"`);
      }
      if (nextOpen && nextOpen.index < nextClose.index) {
        depth++;
        pos = nextOpen.index + nextOpen[0].length;
      } else {
        depth--;
        if (depth === 0) {
          closeStart = nextClose.index;
          closeEnd = nextClose.index + nextClose[0].length;
        } else {
          pos = nextClose.index + nextClose[0].length;
        }
      }
    }

    const replacement = dict[key];
    result += html.slice(cursor, openEnd);
    result += replacement != null ? replacement : html.slice(openEnd, closeStart);
    result += html.slice(closeStart, closeEnd);
    cursor = closeEnd;
    startTagRe.lastIndex = closeEnd;
  }

  result += html.slice(cursor);
  return result;
}

function localizeAttr(html, dict, tagPattern, dataAttr, targetAttr) {
  const tagRe = new RegExp(`<(?:${tagPattern})\\b[^>]*>`, 'gi');
  const dataRe = new RegExp(`${dataAttr}="([\\w-]+)"`);
  const targetRe = new RegExp(`${targetAttr}="[^"]*"`);
  return html.replace(tagRe, (tag) => {
    const keyMatch = tag.match(dataRe);
    if (!keyMatch) return tag;
    const val = dict[keyMatch[1]];
    if (val == null) return tag;
    return tag.replace(targetRe, `${targetAttr}="${escAttr(val)}"`);
  });
}

function localizePlaceholders(html, dict) {
  html = localizeAttr(html, dict, 'input|textarea', 'data-i18n-ph', 'placeholder');
  html = localizeAttr(html, dict, 'img', 'data-i18n-alt', 'alt');
  html = localizeAttr(html, dict, 'button', 'data-i18n-aria', 'aria-label');
  return html;
}

function buildPage(file, lang) {
  const pageKey = path.basename(file, '.html');
  let html = fs.readFileSync(path.join(SRC_PAGES, file), 'utf8');

  html = html
    .replace(/<!--#include:meta-->/g, renderMeta(pageKey, lang))
    .replace(/<!--#include:head-->/g, readPartial('head').replace('<!--#include:jsonld-->', renderJsonLd(lang)))
    .replace(/<!--#include:nav-->/g, renderNav(pageKey, lang))
    .replace(/<!--#include:footer-->/g, readPartial('footer'));

  if (lang === 'en') {
    html = html.replace('<html lang="ko">', '<html lang="en">');
    html = localizeText(html, T.en);
    html = localizePlaceholders(html, T.en);
  }

  // Assets live only at the site root, so every reference must be root-relative —
  // otherwise pages nested under /en/ would look for their own copies.
  html = html.replace(/(src|href)="(img|css|js)\//g, '$1="/$2/');

  const outDir = lang === 'en' ? path.join(DIST, 'en') : DIST;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, file), html);
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
    for (const lang of LANGS) {
      buildPage(page, lang);
    }
  }
  copyStaticAssets();

  console.log(`Built ${pages.length} pages × ${LANGS.length} languages to dist/`);
}

main();
