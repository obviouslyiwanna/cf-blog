---
title: Vue3 Composition API vs Vue2 Options API
tags: [Vue3.0, Composition API,Vue2 Options API]
---

## ✅ 1. **逻辑组织与复用**

* **Options API**：

  * 将代码组织为 `data`, `methods`, `computed`, `watch` 等选项，**结构清晰但逻辑分散**。
  * 当一个功能跨越多个选项时，阅读和维护成本增加。
* **Composition API**：

  * 以**逻辑功能为单位组织代码**，相关逻辑可以集中书写，逻辑清晰、易于维护。
  * 更适合复杂组件或组合多个逻辑模块时使用。

✅ **总结**：Composition API 更适合组织复杂逻辑，逻辑更聚合，提升可读性和可复用性。

---

## ✅ 2. **类型推导和 TypeScript 支持**

* **Options API**：

  * TypeScript 支持不够友好，类型推导依赖 Vue 特定的 API 辅助类型。
* **Composition API**：

  * 使用的是标准的函数和对象，更容易进行**类型推断和显式定义**。
  * 对 IDE 支持和开发体验更好。

✅ **总结**：在 TypeScript 项目中推荐使用 Composition API。

---

## ✅ 3. **Tree-shaking 与打包优化**

* **Options API**：

  * 因为是框架层自动注册生命周期等，tree-shaking 效果较差。
* **Composition API**：

  * 是以函数形式导入使用（如 `ref`, `computed`, `onMounted`），**能更好被 Tree-shaking 优化**。
  * 生成包体更小，更利于构建性能优化。

✅ **总结**：使用 Composition API 构建的大项目构建更高效。

---

## ✅ 4. **this 的使用差异**

* **Options API**：

  * 依赖 `this` 引用组件上下文，容易因作用域变化导致 `this` 指向错误。
* **Composition API**：

  * 几乎完全不依赖 `this`，避免指向混乱。
  * 更贴近函数式编程理念。

✅ **总结**：Composition API 语义清晰、少出错。

---

## ✅ 5. **代码组织风格**

* **Options API**：

  * 风格统一，学习曲线平缓，适合新手上手。
* **Composition API**：

  * 灵活度高，自由度大，但也可能出现“过度灵活”造成风格混乱的问题。

✅ **总结**：小型项目使用 Options API 简单清晰，大型项目建议使用 Composition API 分离逻辑模块。

---

## ✅ 6. **何时使用哪一个？**

| 项目类型              | 推荐使用            |
| ----------------- | --------------- |
| 小型项目或初学者          | Options API     |
| 中大型项目             | Composition API |
| 多人协作、组件复杂         | Composition API |
| 使用 TypeScript 的项目 | Composition API |

---

## ✨ 总结一句话：

> Composition API 更加现代化、灵活、类型安全，适合复杂逻辑的组合与复用；而 Options API 简洁清晰，适合简单组件和初学者。
