#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourcePath = path.resolve(root, 'claude-translator.js');
const outPath = path.resolve(root, 'claude-translator.js');
const i18n = require(path.resolve(root, 'src/i18n'));

function toJsLiteral(value, level = 0) {
  const pad = '    '.repeat(level);
  const nextPad = '    '.repeat(level + 1);

  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof RegExp) return value.toString();

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((item) => `${nextPad}${toJsLiteral(item, level + 1)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const lines = entries.map(([k, v]) => `${nextPad}${JSON.stringify(k)}: ${toJsLiteral(v, level + 1)}`);
    return `{\n${lines.join(',\n')}\n${pad}}`;
  }

  throw new Error(`Unsupported value type: ${typeof value}`);
}

function replaceI18NBlock(sourceCode, i18nLiteral) {
  const anchor = 'const I18N = {';
  const anchorIndex = sourceCode.indexOf(anchor);
  if (anchorIndex === -1) {
    throw new Error('Cannot find I18N block anchor.');
  }

  const openBraceIndex = sourceCode.indexOf('{', anchorIndex);
  let depth = 0;
  let closeBraceIndex = -1;

  for (let i = openBraceIndex; i < sourceCode.length; i += 1) {
    const ch = sourceCode[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        closeBraceIndex = i;
        break;
      }
    }
  }

  if (closeBraceIndex === -1) {
    throw new Error('Cannot locate end of I18N block.');
  }

  const semicolonIndex = sourceCode.indexOf(';', closeBraceIndex);
  if (semicolonIndex === -1) {
    throw new Error('Cannot locate I18N block semicolon.');
  }

  const replacement = `const I18N = ${i18nLiteral};`;
  return sourceCode.slice(0, anchorIndex) + replacement + sourceCode.slice(semicolonIndex + 1);
}

const sourceCode = fs.readFileSync(sourcePath, 'utf8');
const i18nLiteral = toJsLiteral(i18n, 0);
const builtCode = replaceI18NBlock(sourceCode, i18nLiteral);

fs.writeFileSync(outPath, builtCode, 'utf8');

console.log(`Built userscript (in-place): ${outPath}`);
