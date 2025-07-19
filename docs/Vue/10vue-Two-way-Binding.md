---
title: 双向数据绑定是什么（含 MVVM 模型解析）
tags: [Vue, MVVM, 数据绑定, Observer]
---

# 双向数据绑定是什么？

双向数据绑定（Two-way Binding）是指**数据模型和视图之间的数据可以互相影响和更新**的一种机制：

- 修改数据，视图自动更新
- 修改视图（如输入框），数据也随之变化

Vue 中的双向绑定通常通过 `v-model` 实现。

---

# MVVM 模型解析

Vue 使用的是 MVVM（Model-View-ViewModel）架构：

| 组成部分 | 含义 |
|----------|------|
| Model    | 数据层（data） |
| View     | 视图层（DOM） |
| ViewModel| Vue 实例（VM），作为桥梁连接数据和视图 |

- ViewModel 内部负责**数据监听（Observer）**与**模板编译（Compiler）**，实现响应式数据更新。

---

# Vue 双向绑定的原理（Vue2）

Vue2 的双向绑定基于 **Object.defineProperty** 实现：

## 🔁 数据绑定流程：

1. **Observer**：对数据对象进行递归遍历，把每个属性转为 getter/setter（劫持）
2. **Dep（依赖收集器）**：收集依赖，每个属性对应一个 `Dep` 实例
3. **Watcher**：订阅者，绑定更新函数
4. **Compile（编译器）**：解析模板，发现插值表达式或指令绑定，创建 Watcher

当数据变更时，`setter` 被触发，通知 `Dep` 派发更新，执行 Watcher 中的更新函数刷新视图。

## 📌 举例说明：

```js
function defineReactive(obj, key, val) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      dep.depend() // 收集依赖
      return val
    },
    set(newVal) {
      val = newVal
      dep.notify() // 派发更新
    }
  })
}
```

---

# v-model 原理解析

```html
<input v-model="message">
```

等价于：

```html
<input :value="message" @input="message = $event.target.value">
```

> `v-model` 实现了数据 → 视图、视图 → 数据的联动。

---

# Vue3 中的双向绑定

Vue3 使用 **Proxy** 替代了 `defineProperty`，实现更高效的响应式系统：

* **Proxy** 可监听对象的新增/删除属性（Vue2 无法做到）
* 响应式核心由 `reactive()`、`ref()` 等组合式 API 提供

```js
const state = reactive({ count: 0 })
```

无需手动 `Vue.set()`，响应式更加完整。

---

# 为什么是双向绑定，而不是单向？

* 双向：适用于表单、输入类场景（如：登录框、编辑器）
* 单向：适用于展示类、状态驱动型场景（如 props 传参）

Vue 鼓励：**默认单向数据流**，在需要交互时使用双向绑定。

---

# 总结

* Vue 的核心优势之一是其响应式系统。
* Vue2 使用 `defineProperty` + `Dep/Watcher` 实现双向绑定。
* Vue3 则使用 `Proxy` + 更灵活的响应式 API 实现。
* `v-model` 是双向绑定的语法糖，简化了表单开发流程。
* MVVM 模式使得数据和视图解耦，提高了开发效率和代码可维护性。

---

📌 延伸阅读：

* Vue 响应式系统原理
* Watcher 与 Dep 的实现细节
* Vue3 中响应式 API 的底层设计

```