---
title: Vue 中的 keep-alive 使用与原理详解
tags: [Vue, keep-alive, 缓存组件, 生命周期, 性能优化]
---

# 💡 keep-alive 是什么？

`<keep-alive>` 是 Vue 提供的 **内置组件**，用于在组件切换过程中缓存组件实例，从而 **避免重复渲染**，提高性能。

## ✅ 作用

- 缓存被切换掉的组件实例
- 再次激活时状态保留，避免重新渲染 DOM
- 常用于路由切换时缓存页面、表单数据保留、性能优化场景

---

# ⚙️ 使用方式

```vue
<keep-alive>
  <component :is="view"></component>
</keep-alive>
```

或结合 `vue-router`：

```vue
<keep-alive include="Home,About">
  <router-view />
</keep-alive>
```

---

# 🔍 属性说明

| 属性      | 类型                  | 描述                   |
| ------- | ------------------- | -------------------- |
| include | string/RegExp/Array | **只有**匹配的组件会被缓存      |
| exclude | string/RegExp/Array | **排除**的组件不会被缓存       |
| max     | number              | 最多可以缓存的组件实例个数（LRU策略） |

示例：

```vue
<keep-alive :include="/^User/" :exclude="['Login']" :max="5">
  <router-view />
</keep-alive>
```

---

# 🔁 生命周期变化

`keep-alive` 缓存组件后，会多出两个专属生命周期钩子：

| 生命周期钩子        | 说明           |
| ------------- | ------------ |
| `activated`   | 组件从缓存中被激活时调用 |
| `deactivated` | 组件被缓存（失活）时调用 |

### 💥 生命周期对比

首次进入：

1. `beforeCreate`
2. `created`
3. `mounted`
4. `activated`

离开组件：

1. `deactivated`
2. `beforeDestroy`（不调用，组件未被销毁）

再次进入：

* 不会再触发 `created` 和 `mounted`
* 只会触发 `activated`

> ⚠️ 如果不使用 `keep-alive`，组件切换时会被销毁并重新创建。

---

# 🧠 原理简述

* 本质是在 Vue 的 `render` 函数中实现组件的缓存
* `keep-alive` 内部维护了一个 LRU 缓存池（基于 key 匹配）
* 缓存组件不会执行重新创建流程，而是复用旧 VNode 实例

```js
render() {
  const vnode = getVNode()
  const key = vnode.key || vnode.componentOptions.Ctor.cid
  if (cache[key]) {
    vnode.componentInstance = cache[key].componentInstance
  } else {
    cache[key] = vnode
  }
  return vnode
}
```

---

# 📦 keep-alive + router 实践建议

* 组件必须有唯一的 `name` 才能被 include/exclude 命中
* 避免缓存过多页面导致内存飙升，合理使用 `max`
* 可以通过 `key` 强制重新渲染组件（如使用 `key="$route.fullPath"`）

---

# 📌 常见场景

### 表单填写保留：

```vue
<keep-alive>
  <FormPage />
</keep-alive>
```

### 多页签切换保持状态：

```vue
<Tabs>
  <keep-alive>
    <component :is="activeTabComponent" />
  </keep-alive>
</Tabs>
```

### 路由缓存：

```vue
<keep-alive :include="['HomePage', 'UserPage']">
  <router-view />
</keep-alive>
```

---

# 📤 缓存数据的获取

缓存组件再次激活后不会重新调用 `created`，如果你需要更新数据：

### ✅ 两种方案：

1. 在 `activated()` 生命周期钩子中请求数据
2. 使用 `beforeRouteEnter()` + `next(vm => vm.loadData())`

---

# ✅ 总结

| 特性                | 是否缓存 | 是否销毁 | 生命周期                          |
| ----------------- | ---- | ---- | ----------------------------- |
| 普通组件切换            | ❌    | ✅    | created → mounted             |
| keep-alive 缓存组件首次 | ✅    | ❌    | created → mounted → activated |
| keep-alive 再次进入   | ✅    | ❌    | activated                     |
| keep-alive 离开     | ✅    | ❌    | deactivated                   |

`keep-alive` 是 Vue 中非常强大的性能优化工具，合理使用可以显著提升用户体验，但滥用也可能导致内存泄漏等问题。

---

# 🔗 延伸阅读

* [Vue 官方文档 - keep-alive](https://cn.vuejs.org/api/built-in-components.html#keep-alive)
* [深入理解 Vue keep-alive 缓存机制](https://juejin.cn/post/6844904009073655821)
