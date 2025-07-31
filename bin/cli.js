#!/usr/bin/env node

const path = require('path');
const { replaceVueI18n } = require('../lib/replacer');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`Usage: vue-i18n-replacer <vueFile> <i18nFile> [outputFile]`);
  process.exit(1);
}

const vueFile = path.resolve(process.cwd(), args[0]);
const i18nFile = path.resolve(process.cwd(), args[1]);
const outputFile = path.resolve(process.cwd(), args[2] || vueFile.replace('.vue', '.output.vue'));

replaceVueI18n({ vueFilePath: vueFile, i18nFilePath: i18nFile, outputFilePath: outputFile });
