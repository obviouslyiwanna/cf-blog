---
title: Vue 3 为什么使用 Proxy 替代 Object.defineProperty 来实现响应式？
tags: [Vue3.0, Proxy,响应式]
---

## 🔁 Vue2 的响应式：Object.defineProperty

在 Vue 2 中，响应式系统是通过 `Object.defineProperty()` 来劫持对象的属性：

```js
Object.defineProperty(obj, 'key', {
  get() { ... },
  set(val) { ... }
})
```

### ⚠️ 问题：

1. **只能劫持“已有属性”**

   * 新增属性或删除属性时，需要手动调用 `Vue.set()` 或 `Vue.delete()` 才能响应式。
   * 无法监控数组索引或 `length` 变化。

2. **对象嵌套需要递归遍历（初始化时）**

   * 初始化时必须递归遍历每个属性才能设置响应式，性能差。
   * 比如一个大对象或深层嵌套对象时，初始化开销大。

---

## ✅ Vue3 的响应式：Proxy API

Vue 3 使用 ES6 新增的 `Proxy` 对象来构建响应式系统：

```js
const proxy = new Proxy(target, handler)
```

---

## ✨ Proxy 相比 defineProperty 的优势

你列出了一些不错的点，下面我补充并结构化：

### 1️⃣ 更强的能力（支持的拦截类型多）

* Proxy 支持 **13 种 trap（拦截器）**，而 defineProperty 只支持 get 和 set。

  ✅ 例如：

  * `get` / `set`
  * `has`：拦截 `in` 操作符
  * `deleteProperty`：拦截 `delete obj.key`
  * `ownKeys`：拦截 `Object.keys()`、`for...in`
  * `defineProperty` / `getOwnPropertyDescriptor` 等

  ➤ 这使得 Vue3 可以更完整地追踪所有对对象的操作（不仅限于赋值和取值），响应式能力大幅增强。

---

### 2️⃣ 更灵活地处理“新增/删除属性”与数组变化

* `defineProperty` 无法感知新增属性和删除属性，必须用 `Vue.set()`、`Vue.delete()`。
* `Proxy` 的 `set`、`deleteProperty` 可以原生捕获这些变化。

✅ 所以 Vue 3 响应式不需要像 Vue 2 那样特殊处理新增/删除属性，也能追踪数组 `.length` 或 `push` 等方法。

---

### 3️⃣ 延迟递归（懒代理）

> 你提到的一点非常重要：**Vue 3 中使用 get 时再递归代理（惰性代理）**。

* Vue 2 的 defineProperty 必须**一开始就递归所有子属性**，哪怕你永远不访问它。
* Vue 3 的 Proxy 只在 `get` 某个属性的时候，**才判断这个属性是否是对象**，然后再创建 Proxy 代理。

✅ 优势：

* 初始化快（性能更好）
* 更省内存，访问时才递归代理子对象

---

### 4️⃣ 支持 Map / Set / WeakMap / WeakSet 等结构

* Vue 2 的响应式系统不支持 `Map`、`Set` 等复杂数据结构，因为 `defineProperty` 只能劫持对象属性。
* Vue 3 中通过 Proxy + Reflect，可以自定义拦截这些对象的方法，比如 `.get()`、`.set()`。

✅ 所以 Vue 3 的响应式系统可以很好地处理 `Map`、`Set`，并且保持响应式能力。

---

### 5️⃣ Reflect 配合 Proxy 更优雅

Proxy 和 `Reflect` 是一对组合：

```js
get(target, key, receiver) {
  return Reflect.get(target, key, receiver)
}
```

* `Reflect` 提供默认行为，避免手写底层对象操作逻辑。
* 保证操作语义一致、代码更清晰。

---

## 🔚 总结对比

| 特性      | Vue 2 (defineProperty) | Vue 3 (Proxy)  |
| ------- | ---------------------- | -------------- |
| 劫持能力    | 仅 `get`/`set`          | 13种拦截能力        |
| 数组支持    | 有限制                    | 完整支持           |
| 新增/删除属性 | 不可响应                   | 可响应            |
| 深层嵌套    | 初始化递归                  | 按需懒加载          |
| 支持对象类型  | Object / Array         | 支持 Map / Set 等 |
| 性能      | 初始化慢、内存多               | 初始化快、按需递归      |
| API 灵活性 | 低                      | 高              |

---

**Proxy 实现了功能更丰富的响应式系统，适配现代 JS 对象操作的复杂需求，效率也更高**——是 Vue 3 转向 Proxy 的核心原因。
