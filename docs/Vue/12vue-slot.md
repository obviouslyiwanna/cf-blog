---
title: Vue 中对 slot 的理解及使用场景
tags: [Vue, slot, 插槽, 组件通信, 插槽原理]
---

# Vue 中的 slot 是什么？

`slot` 是 Vue 提供的一种 **内容分发机制**，用于让父组件在使用子组件时，**向子组件的指定位置插入 HTML 内容**。

简单来说，slot 就像是组件中的占位符，父组件可以把内容“填进去”，子组件再“渲染出来”。

---

## 📌 为什么需要 slot？

组件的本质是复用 —— UI 和行为的复用。但有些组件的结构是通用的，**内容是变化的**。

**使用插槽可以让我们在复用结构的同时，自定义其中的内容。**

---

## 🧱 插槽的类型

### 1️⃣ 默认插槽

子组件中写：

```vue
<slot></slot>
```

父组件中传内容：

```vue
<CustomCard>
  <p>这是内容</p>
</CustomCard>
```

### 2️⃣ 具名插槽（Named Slot）

子组件中写：

```vue
<slot name="header"></slot>
<slot name="footer"></slot>
```

父组件中使用：

```vue
<CustomCard>
  <template #header>
    <h1>我是标题</h1>
  </template>

  <template #footer>
    <p>我是底部</p>
  </template>
</CustomCard>
```

> 🔁 等价写法：`<template v-slot:header>...</template>`

### 3️⃣ 作用域插槽（Scoped Slot）

让子组件将内部数据传递给父组件使用，**增强插槽的动态性**。

子组件中：

```vue
<slot :user="userInfo"></slot>
```

父组件中：

```vue
<CustomCard v-slot="{ user }">
  <p>用户名：{{ user.name }}</p>
</CustomCard>
```

---

## ⚙️ 插槽的原理

Vue 中插槽的本质是：**一个返回 VNode 的函数**。

> 插槽的完整渲染流程：
> `template` → `render function` → `slot` 渲染为 VNode → 最终渲染为 DOM。

### 插槽数据结构：

* 子组件接收 `this.$slots` 和 `this.$scopedSlots`
* 父组件通过 `createElement` 创建 VNode 并传入

---

## 🧠 使用场景

### ✅ 1. 通用布局组件

```vue
<Layout>
  <template #header><Header /></template>
  <template #default><MainContent /></template>
  <template #footer><Footer /></template>
</Layout>
```

### ✅ 2. 表格/列表组件的自定义列渲染

```vue
<Table :data="list">
  <template #column="slotProps">
    <span>{{ slotProps.row.name }}</span>
  </template>
</Table>
```

### ✅ 3. 动态表单、自定义操作栏、自定义模态框内容等

---

## 🚨 注意点

* 插槽内容来自父组件，在子组件中展示，**本质是父组件作用于子组件的内容传递方式**
* 作用域插槽常用于组件库的封装，传递复杂数据结构
* `v-slot` 是语法糖，建议统一使用 `template #name="slotProps"` 格式

---

## 🧾 总结

| 插槽类型  | 用途            | 是否支持子组件向父组件传值 |
| ----- | ------------- | ------------- |
| 默认插槽  | 插入默认内容        | ❌             |
| 具名插槽  | 插入多个命名区域      | ❌             |
| 作用域插槽 | 插入内容并能访问子组件数据 | ✅             |

---

## 🔗 延伸阅读

* [Vue 官方插槽文档](https://cn.vuejs.org/guide/components/slots.html)
* [Vue slot 原理解析](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/componentSlots.ts)

