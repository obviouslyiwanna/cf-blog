---
title: Vue中的 $nextTick 有什么作用？
tags: [Vue, nextTick, 异步更新, DOM更新]
---

# Vue 中的 `$nextTick` 有什么作用？

`Vue.nextTick` 是 Vue 提供的一个异步方法，用于在 **DOM 更新之后**执行一段回调逻辑。  

它的本质是将回调函数推迟到 **下一个 DOM 更新周期之后**执行，确保你操作的是更新后的 DOM。

---

## 📌 为什么需要 `$nextTick`

在 Vue 中，数据更新是异步的，Vue 会开启一个 **异步队列**，批量执行数据更新，以提升性能。

```js
this.message = '更新了'
console.log(this.$refs.text.innerText) // ❌ 可能还没更新！
this.$nextTick(() => {
  console.log(this.$refs.text.innerText) // ✅ DOM已更新
})
```

> 所以 `$nextTick` 就是：**等 Vue 更新 DOM 后，再执行你的代码。**

---

## 🧠 原理解析

Vue 的响应式更新过程是异步执行的：

1. 数据变更后，Vue 将更新任务加入更新队列（flushSchedulerQueue）。
2. 这些任务在 **当前宏任务结束后的微任务中**被处理。
3. `$nextTick` 注册的回调，也会被推入微任务队列中，在 DOM 更新完成后执行。

### ✅ 简化流程图：

```
数据变更
   ↓
异步更新队列
   ↓
更新 Virtual DOM → Patch → 更新真实 DOM
   ↓
执行 nextTick 回调
```

---

## ⚙️ 实现机制（Vue2）

```js
Vue.prototype.$nextTick = function (cb) {
  return nextTick(cb, this)
}

function nextTick(cb, ctx) {
  callbacks.push(() => cb.call(ctx))
  if (!pending) {
    pending = true
    timerFunc() // 微任务或宏任务
  }
}
```

* Vue 会优先使用 **Promise.then** 注册微任务（若浏览器支持）
* 不支持时回退到 `MutationObserver` 或 `setTimeout`

---

## 📚 使用场景

### ✅ 场景 1：获取最新 DOM 状态

```js
this.message = '更新'
this.$nextTick(() => {
  console.log(this.$refs.msg.innerText) // 操作更新后的 DOM
})
```

### ✅ 场景 2：配合动画、手动测量

```js
this.show = true
this.$nextTick(() => {
  this.doTransition(this.$refs.box.offsetHeight)
})
```

### ✅ 场景 3：避免频繁刷新

Vue 将多个数据变更合并处理，只有一次 DOM 更新，节省性能。

---

## 🆚 `setTimeout` 与 `$nextTick`

| 特性          | setTimeout | Vue.nextTick    |
| ----------- | ---------- | --------------- |
| 执行时机        | 下一个宏任务     | 当前宏任务后、DOM更新后   |
| 控制 DOM 更新时机 | ❌ 无法精确控制   | ✅ 精确在 DOM 更新后执行 |
| 和 Vue 配合度   | ❌ 有一定不确定性  | ✅ Vue 内部专用逻辑支持  |

---

## 🌐 Vue3 中的变化

Vue3 中 `$nextTick` 同样存在，但底层改为使用 [flushPromises](https://github.com/vuejs/core/blob/main/packages/shared/src/nextTick.ts)，基于 **微任务 + queueJob 机制**，配合组合式 API 使用：

```js
import { nextTick } from 'vue'

nextTick(() => {
  console.log('DOM updated')
})
```

---

## ✅ 总结

* `$nextTick` 允许开发者在 DOM 更新后执行逻辑，避免“操作旧 DOM”的 bug。
* 适用于：

  * DOM 操作
  * 动画触发
  * 动态测量
* 核心机制是：将回调加入微任务队列，等待 DOM 更新完成后执行。
* 在 Vue3 中也被保留，配合组合式 API 更加灵活。
