#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

const TOP_LEVEL_ORDER = {
  'index': 0,
  'beads': 1,
  'gastown': 2,
  'skills-bank': 3,
  'prompt-bank': 4,
  'tooling-mcp': 5,
  'orchestration': 6,
  'context': 7,
  'lab': 8,
};

const CUSTOM_TITLES = {
  'index': 'Home',
  'beads': 'Beads',
  'gastown': 'Gastown',
  'skills-bank': 'Skills Bank',
  'prompt-bank': 'Prompt Bank',
  'tooling-mcp': 'Tooling & MCP',
  'orchestration': 'Orchestration',
  'context': 'Context',
  'lab': 'Lab',
  'cli-reference': 'CLI Reference',
  'gupp': 'GUPP',
};

function filenameToTitle(filename) {
  const name = filename.replace(/\.(mdx?|jsx?|tsx?)$/, '');
  if (CUSTOM_TITLES[name]) return CUSTOM_TITLES[name];
  return name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getDirectoryItems(dirPath) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return [];
  }
  const items = fs.readdirSync(dirPath);
  return items
    .filter(item => !item.startsWith('.') && !item.startsWith('_') && item !== 'node_modules')
    .map(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.lstatSync(itemPath);
      const isFile = stats.isFile();
      const isDir = stats.isDirectory() || stats.isSymbolicLink();
      return {
        name: item,
        path: itemPath,
        isFile,
        isDir,
        basename: item.replace(/\.(mdx?|jsx?|tsx?)$/, ''),
      };
    })
    .filter(item => item.isFile ? /\.(mdx?|jsx?|tsx?)$/.test(item.name) : item.isDir);
}

function generateMetaForDirectory(dirPath, isTopLevel = false) {
  const items = getDirectoryItems(dirPath);
  if (items.length === 0) return null;

  const meta = {};
  const sortedItems = items.sort((a, b) => {
    if (isTopLevel && TOP_LEVEL_ORDER[a.basename] !== undefined && TOP_LEVEL_ORDER[b.basename] !== undefined) {
      return TOP_LEVEL_ORDER[a.basename] - TOP_LEVEL_ORDER[b.basename];
    }
    if (a.basename === 'README' || a.basename === 'index') return -1;
    if (b.basename === 'README' || b.basename === 'index') return 1;
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.basename.localeCompare(b.basename);
  });

  sortedItems.forEach(item => {
    meta[item.basename] = filenameToTitle(item.name);
  });

  return meta;
}

function processDirectory(dirPath, isTopLevel = false) {
  const metaPath = path.join(dirPath, '_meta.json');
  const meta = generateMetaForDirectory(dirPath, isTopLevel);

  if (meta) {
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
    console.log(`✓ Generated ${path.relative(PAGES_DIR, metaPath)}`);
  }

  const items = getDirectoryItems(dirPath);
  items.forEach(item => {
    if (item.isDir) {
      try {
        const realPath = fs.realpathSync(item.path);
        if (fs.statSync(realPath).isDirectory()) {
          processDirectory(item.path, false);
        }
      } catch (err) {
        console.warn(`⚠️  Skipping ${item.path}: ${err.message}`);
      }
    }
  });
}

function main() {
  console.log('🔧 Generating _meta.json files for Nextra navigation...\n');
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Error: pages directory not found at ${PAGES_DIR}`);
    process.exit(1);
  }
  processDirectory(PAGES_DIR, true);
  console.log('\n✨ Done! All _meta.json files generated.');
}

if (require.main === module) {
  main();
}

module.exports = { generateMetaForDirectory, filenameToTitle };
