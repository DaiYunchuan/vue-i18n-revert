// lib/replacer.js
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function flatten (obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object') Object.assign(acc, flatten(val, fullKey));
    else acc[fullKey] = val;
    return acc;
  }, {});
}

function replaceVueI18n ({ vueFilePath, i18nFilePath, outputFilePath }) {
  // === 1. Load and flatten i18n file ===
  const tsContent = fs.readFileSync(i18nFilePath, 'utf-8');
  const match = tsContent.match(/export\s+default\s+({[\s\S]+});?/);
  const raw = match ? match[1] : '{}';
  const translations = eval('(' + raw + ')');
  const flatMap = flatten(translations);

  // === 2. Load .vue file ===
  const vueContent = fs.readFileSync(vueFilePath, 'utf-8');
  let replaced = vueContent;

  // === 3. Replace template ===
  replaced = replaced.replace(/\{\{\s*\$t\((['"`])([^'"`]+)\1\s*,\s*({[^}]+})\s*\)\s*\}\}/g, (_, quote, key, argsStr) => {
    try {
      const args = eval(`(${argsStr})`);
      let value = flatMap[key];
      if (value) {
        Object.entries(args).forEach(([k, v]) => {
          value = value.replace(new RegExp(`{\\s*${k}\\s*}`, 'g'), v);
        });
        return value;
      }
    } catch {
      return key;
    }
    return key;
  });

  replaced = replaced.replace(/\{\{\s*\$t\((['"`])([^'"`]+)\1\)\s*\}\}/g, (_, quote, key) => flatMap[key] || key);

  // === 4. Replace script
  const scriptMatch = replaced.match(/<script[^>]*lang=["']ts["'][^>]*>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    const originalScript = scriptMatch[1];
    const ast = parse(originalScript, { sourceType: 'module', plugins: ['typescript'] });

    traverse(ast, {
      CallExpression (path) {
        const callee = path.node.callee;
        const [arg1, arg2] = path.node.arguments;

        if (callee.type === 'Identifier' && callee.name === 't' && arg1?.type === 'StringLiteral') {
          const key = arg1.value;
          let value = flatMap[key];

          if (value) {
            if (arg2?.type === 'ObjectExpression') {
              arg2.properties.forEach(prop => {
                if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier' && prop.value.type === 'StringLiteral') {
                  const k = prop.key.name;
                  const v = prop.value.value;
                  value = value.replace(new RegExp(`{\\s*${k}\\s*}`, 'g'), v);
                }
              });
            }
            path.replaceWith({ type: 'StringLiteral', value });
          }
        }
      }
    });

    const newScript = generate(ast).code;
    replaced = replaced.replace(originalScript, newScript);
  }

  // === 5. Write result ===
  fs.writeFileSync(outputFilePath, replaced, 'utf-8');
  console.log(`✅ 替换完成，输出文件：${outputFilePath}`);
}

module.exports = { replaceVueI18n };
