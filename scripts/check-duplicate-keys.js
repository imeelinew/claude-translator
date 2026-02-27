#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'claude-translator.js');
const source = fs.readFileSync(filePath, 'utf8');
const lines = source.split(/\r?\n/);

const map = new Map();

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  const trimmed = line.trim();
  if (trimmed.startsWith('//')) continue;

  const m = line.match(/^\s*"([^"]+)"\s*:\s*"/);
  if (!m) continue;

  const key = m[1];
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(i + 1);
}

const duplicates = [...map.entries()].filter(([, rows]) => rows.length > 1);

if (duplicates.length === 0) {
  console.log('No active duplicate keys found.');
  process.exit(0);
}

console.log('Active duplicate keys found:');
for (const [key, rows] of duplicates) {
  console.log(`- ${key}: ${rows.join(', ')}`);
}

process.exit(1);
