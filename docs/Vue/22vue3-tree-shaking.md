---
title: Vue 3 中 Tree Shaking 特性
tags: [Vue3.0, Tree Shaking]
---

## 🔍 什么是 Tree Shaking？

**Tree Shaking** 是一种\*\*“摇掉未使用代码”\*\*的优化技术，全称叫做 **Dead Code Elimination（DCE）**。

在 Vue 3 中，它的作用是：
✅ **移除未使用的 API、模块或依赖项**，
✅ **减小构建体积，提高加载效率。**

---

## 🚀 Vue 3 中为什么支持 Tree Shaking？

Vue 3 源码采用了 **ES Module** 格式（即 `import` / `export`），
这是一种 **静态模块系统**，编译器在构建时就可以**准确识别哪些 API 被用到了**，哪些可以摇掉。

这使得打包工具（如 Vite、Webpack 5、Rollup）可以在构建时进行 Tree Shaking。

---

## 🆚 Vue 2 与 Vue 3 的区别？

| 特性           | Vue 2             | Vue 3               |
| ------------ | ----------------- | ------------------- |
| 模块系统         | CommonJS（运行时动态引入） | ES Module（静态结构）     |
| Tree Shaking | 不支持（打包体积大）        | 支持（未使用的 API 不会被打包）  |
| 编译优化         | 无法提前优化            | 静态分析 + Tree Shaking |

---

## 📦 举个例子：使用 Vue 3 API

假如你只使用了 `ref`，而没有用 `reactive`, `watch`, `computed` 等等：

```js
// main.js
import { ref } from 'vue'

const count = ref(0)
```

### Tree Shaking 会做什么？

构建工具会分析到：

* 你只使用了 `ref`
* `reactive`, `watch`, `computed` 没有被使用

🔧 **最终打包时只会保留 `ref`，其余的 API 都被“摇掉”了！**

---

## 🍰 类比记忆：Vue 3 Tree Shaking 比喻

你之前的蛋糕比喻非常形象，再补充一句：

> Vue 2 是“统统打包进去再筛选”，Vue 3 是“只挑有用的材料开始做蛋糕”。

---

## 🔧 使用条件

要启用 Tree Shaking，项目需要满足以下条件：

| 条件            | 原因说明                                                   |
| ------------- | ------------------------------------------------------ |
| 使用 Vue 3      | Vue 3 官方支持基于 ES Module 的 Tree Shaking                  |
| 使用 ES6 Module | 必须使用 `import`/`export`，不能用 `require()`                 |
| 构建工具支持        | 使用支持 Tree Shaking 的工具如 Vite、Rollup、Webpack 5+          |
| 禁用副作用         | `package.json` 中需配置 `"sideEffects": false` 来避免副作用代码被保留 |

---

## 💡 额外拓展：Vue3 为了 Tree Shaking 做的设计改动

1. 所有 API 通过函数导出，如 `ref()`, `watch()`，不会挂载到 Vue 实例上（不像 Vue 2 的 `this.$xxx`）；
2. Composition API 写法也天然利于 Tree Shaking；
3. 全量引入 Vue 也不会造成多余代码打包（仅用即引）；

---

## ✅ 总结一句话：

> **Vue 3 中的 Tree Shaking 本质是借助 ES Module + 静态分析，构建时移除未使用代码，从而优化打包体积和加载性能。**
