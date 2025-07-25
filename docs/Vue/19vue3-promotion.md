---
title: Vue 3.0 性能提升主要体现在哪些方面？
tags: [Vue3.0, 性能提升，优化]
---

Vue 3 相比 Vue 2 在多个维度上做了系统性优化，特别是在 **响应式系统、编译优化、运行时性能** 三个关键方面：

---

## ✅ 一、响应式系统升级（更快、更低成本）

| 对比项       | Vue 2 (`Object.defineProperty`) | Vue 3 (`Proxy`)       |
| --------- | ------------------------------- | --------------------- |
| 响应式原理     | 递归遍历所有属性做 getter/setter 拦截      | 使用 `Proxy` 深层拦截，按需懒递归 |
| 新增/删除属性支持 | 不支持（需 `Vue.set`）                | 原生支持新增/删除属性           |
| 数组响应式支持   | 劫持常用数组方法，部分问题难解决                | `Proxy` 可完美代理数组       |
| 内存性能      | 所有层级初始化监听，资源浪费                  | 只监听访问过的属性，节省内存和计算     |

> Vue3 的 `Proxy` 响应式系统通过\*\*懒劫持（lazy reactive）\*\*机制提升了响应式性能，避免 Vue2 初始化时深层对象递归造成的性能瓶颈。

---

## ✅ 二、编译优化（更智能的模板编译）

Vue 3 的模板编译器提升了 Patch 效率，主要体现在以下几点：

### 1️⃣ **静态提升（Static Hoisting）**

* 会将模板中**不变的 DOM 结构提升为常量**，缓存到 `_hoisted_1` 等变量中，渲染时直接复用。
* **首次渲染时创建，后续渲染不再重复创建、patch，提高渲染速度**

```js
const _hoisted_1 = /*#__PURE__*/createVNode("div", { class: "static" }, "静态内容")
```

### 2️⃣ **PatchFlag 静态标记机制**

* Vue3 编译时会为 VNode 添加 patchFlag，例如：

  * `-1`: 永远不会更新的静态节点
  * `TEXT`: 动态文本节点
  * `CLASS`: 动态 class
  * `PROPS`: 动态属性等

* 通过 patchFlag，diff 过程可以跳过不必要的比较，**只对动态节点做最小粒度的更新**，极大优化 patch 效率。

### 3️⃣ **事件监听缓存（Event Handler Caching）**

* 对于静态事件监听器，例如：`@click="handleClick"`，Vue3 编译时会缓存 handler，不再每次更新都重新绑定。
* 避免每次重新创建事件函数，提高渲染性能，降低 GC 压力。

---

## ✅ 三、服务端渲染优化（SSR优化）

Vue3 针对 SSR 渲染也做了优化，主要有：

| 优化点                 | 说明                                                                           |
| ------------------- | ---------------------------------------------------------------------------- |
| `createStaticVNode` | 当静态内容较多时，编译器会生成 `createStaticVNode` 节点，直接通过 `innerHTML` 插入 DOM，提高 SSR 首屏渲染效率 |
| Streaming 模式        | Vue 3 支持“流式渲染”，可以边生成 HTML 边输出给客户端，进一步缩短首屏白屏时间                                |

---

## ✅ 四、打包优化：更小更快的构建

| 优化项             | 说明                                      |
| --------------- | --------------------------------------- |
| Tree-Shaking 友好 | 所有 API 按模块导出，构建工具如 Vite、Rollup 可移除未使用代码 |
| Vite 构建器        | Vue3 官方推荐使用 Vite，基于 esbuild，构建速度数量级提升   |

---

## 🧠 总结：Vue3 性能提升三大方向

| 分类       | 代表优化项                                      |
| -------- | ------------------------------------------ |
| 响应式系统    | 使用 Proxy 替代 defineProperty；懒递归处理深层响应式      |
| 编译优化     | 静态提升；PatchFlag 标记；事件监听缓存                   |
| SSR 渲染优化 | `createStaticVNode` 静态节点优化；支持 streaming 渲染 |
