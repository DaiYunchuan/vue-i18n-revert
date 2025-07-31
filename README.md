
# Vue i18n Replacer

**Vue i18n Replacer** 是一个将多语言文件中的翻译内容，还原到 Vue 文件中的命令行工具。  
适用于 Vue + i18n 项目在开发或调试阶段查看原始文本内容，提升开发效率。

---

## ✨ 功能特点

- 支持将 `i18n` 文件中的内容批量替换还原回 Vue 文件
- 支持 TypeScript 格式的多语言文件
- 支持 CLI 命令行调用，简单易用

---

## 📦 安装

使用 npm 全局安装：

```bash
npm install vue-i18n-replacer
```

或使用 pnpm：

```bash
pnpm add vue-i18n-replacer
```

---

## 🚀 快速开始

以一个示例说明：

```bash
vue-i18n-replacer ./pages/tsst.vue ./i18n/language/en.ts
```

- 第一个参数是你要还原的 Vue 文件路径
- 第二个参数是多语言文件路径（支持嵌套结构）

---

## 🖼️ 示例展示

### 原始 Vue 文件（含 `$t`，`$t('xxxxx',{xxx:'xxxxx'})` 多语言调用）

![原始 Vue 文件](/public/images/orgvue.png)

---

### 多语言文件结构

![语言文件结构](/public/images/i18nflie.png)

---

### 终端输入命令

![终端输入命令](/public/images/input.png)

---

### 控制台输出日志

![终端输出结果](/public/images/output.png)

---

### 最终还原效果对比

![最终 Vue 文件对比](/public/images/over.png)

---

## 📁 目录结构建议

```bash
.
├── pages/
│   └── tsst.vue
└── i18n/
    └── language/
        └── en.ts
```

---

## 💡 常见问题

**Q: 支持哪些语言文件格式？**  
A: 当前支持 `.ts` 文件，且导出结构需为对象形式 `export default { ... }`

**Q: 会覆盖原始 Vue 文件吗？**  
A: 是的，请在操作前自行做好备份，或通过版本控制管理文件。

**Q: 能否批量处理多个文件？**  
A: 当前版本暂不支持批量处理多个 Vue 文件，后续可支持通配符路径。

---

## 🧩 许可协议

[MIT License](./LICENSE)

---

## 🙌 欢迎贡献

如果你觉得该工具有用，欢迎提 Issue 或 PR 优化功能！✨
