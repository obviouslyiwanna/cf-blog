---
title: Vue 中的组件通信方式有哪些？
tags: [Vue, 组件通信, props, emit, EventBus, Vuex]
---
# Vue 中的组件通信方式有哪些？

在 Vue 应用中，组件之间的通信是日常开发的重要部分。根据组件之间的关系不同，Vue 提供了多种通信方式来满足需求。

---

## 一、父子组件通信

### 1. 父 → 子：`props`

父组件通过 `props` 向子组件传递数据：

```vue
<!-- 父组件 -->
<child :title="parentTitle" />

<!-- 子组件 -->
props: ['title']
```

### 2. 子 → 父：`$emit`

子组件通过 `$emit` 触发事件，通知父组件：

```vue
// 子组件
this.$emit('updateTitle', newTitle);

// 父组件
<child @updateTitle="handleUpdate" />
```

### 3. 子组件访问父组件：`this.$parent`、`ref`

* `this.$parent`：访问父组件实例（不推荐，耦合性高）
* `ref`：父组件通过 `ref` 获取子组件实例，调用其方法或访问属性

```vue
<!-- 父组件 -->
<child ref="childRef" />

// 父组件方法
this.$refs.childRef.someChildMethod()
```

---

## 二、兄弟组件通信

### 1. 借助共同的父组件：事件中转

```js
// 兄弟A
this.$emit('add');

// 父组件监听
<brother-a @add="handleAdd" />

// 兄弟B
<brother-b :count="count" />
```

### 2. `EventBus`（Vue2）

```js
// event-bus.js
export const EventBus = new Vue();

// A组件
EventBus.$emit('msg', data);

// B组件
EventBus.$on('msg', (data) => { ... });
```

> 注意：Vue3 已废弃 `$on`，可使用第三方库如 mitt。

---

## 三、跨层级通信（祖孙组件）

### 1. `provide / inject`

祖先组件提供数据，后代组件注入数据：

```js
// 祖先组件
provide('theme', 'dark');

// 后代组件
inject('theme');
```

> ⚠️ 缺点：不是响应式（Vue 3 中通过 `ref`/`reactive` 提供可响应的值）

---

## 四、非关系组件通信（无直接关系）

### 1. 状态管理工具（推荐）

* Vuex（Vue2 官方状态管理）
* Pinia（Vue3 推荐，轻量且组合式 API）

```js
// store.js
export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ }
  }
})
```

### 2. LocalStorage / SessionStorage

* 用于持久化跨组件数据共享
* 适合用户信息、Token、主题设置等场景

---

## 五、其它通信方式补充

| 通信方式                  | 场景                        | Vue版本支持   |
| --------------------- | ------------------------- | --------- |
| `$attrs / $listeners` | 父组件向子组件传递非 props 属性和事件监听器 | Vue2      |
| `mitt`、`tiny-emitter` | Vue3 替代 EventBus          | Vue3      |
| `$parent / $root`     | 获取父组件或根组件实例（不推荐）          | Vue2/Vue3 |
| 动态组件通信                | 利用 `v-bind:is` 切换组件并保持数据  | Vue2/Vue3 |

---

## 六、选择通信方式的建议

| 组件关系  | 推荐通信方式             |
| ----- | ------------------ |
| 父 → 子 | props              |
| 子 → 父 | \$emit             |
| 兄弟组件  | EventBus / 共同父组件中转 |
| 祖孙组件  | provide / inject   |
| 跨组件通信 | Vuex / Pinia       |

---

## 七、总结一句话

> Vue 提供了从 props、emit 到 Vuex、provide/inject 等多种组件通信方式，应根据组件之间的关系灵活选择，避免不必要的耦合和复杂度。
