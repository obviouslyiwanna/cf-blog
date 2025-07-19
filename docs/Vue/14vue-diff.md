---
title: Vue 的 Diff 算法详解
tags: [Vue, 虚拟DOM, Diff算法, patch, 性能优化]
---

# 💡 什么是 Diff 算法？

Vue 中的 Diff 算法是用于比较**新旧虚拟 DOM**差异并将最小变更同步到真实 DOM 的一种策略。主要体现在 `patch(oldVNode, newVNode)` 过程中。

Vue 的 Diff 算法基于以下优化原则：

- **同层比较，不跨层比较**
- **双端指针法：从头尾向中间收缩**
- **利用 key 快速定位移动的节点**
- **尽可能复用旧节点，减少 DOM 操作**

---

# 🔍 Diff 发生的时机

数据发生变化时：
1. 数据改变 → `setter` 触发 → `Dep.notify()` 通知 Watcher
2. Watcher 更新视图 → 调用 `vm._update()` → `patch(oldVNode, newVNode)`
3. `patch` 函数通过 Diff 算法比较新旧 VNode → 最小化更新真实 DOM

---

# 🚀 Diff 核心流程

Vue 的 Diff 算法实现于 `patch()` 函数中，使用了**双端比较**优化方案。

### 🧭 四个指针

```js
let oldStartIdx = 0
let oldEndIdx = oldCh.length - 1
let newStartIdx = 0
let newEndIdx = newCh.length - 1
```

### 🔁 比较策略

在同层内的节点进行以下四种比较：

1. **旧头 vs 新头**：`oldStartVnode` vs `newStartVnode`
2. **旧尾 vs 新尾**：`oldEndVnode` vs `newEndVnode`
3. **旧头 vs 新尾**：`oldStartVnode` vs `newEndVnode`
4. **旧尾 vs 新头**：`oldEndVnode` vs `newStartVnode`

以上都无法匹配，则通过 `key` 做查找：

* 查找是否存在可复用节点
* 找不到就创建新的 DOM 节点插入
* 找到就移动位置 + patch

### 🧱 patch 流程图（简化）

```text
patch(oldVNode, newVNode)
  ├── sameVnode(oldVNode, newVNode)
  │     ├── patchVnode()      // 更新属性和 children
  └── 不同则：
        ├── 创建新节点
        └── 删除旧节点
```

---

# 🔧 关键函数

### `sameVnode(a, b)`

判断两个 VNode 是否可以复用的条件：

```js
function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag && isComment(a) === isComment(b)
}
```

### `patchVnode(oldVNode, vnode)`

* 对比 `props` 差异并更新
* 对比 `children` 并递归调用 `updateChildren()`

---

# ✨ 为什么使用双端比较？

* 相比 React 的单向遍历 O(n)，Vue 使用双端对比优化为 O(n)
* 避免大量移动或查找开销
* 常用于 `<transition-group>`、列表渲染时减少真实 DOM 操作

---

# 🧠 示例说明

假设我们有以下两个列表：

```html
<!-- 旧 -->
<li key="a"></li>
<li key="b"></li>
<li key="c"></li>

<!-- 新 -->
<li key="c"></li>
<li key="b"></li>
<li key="a"></li>
```

通过 Diff：

1. oldStart (`a`) vs newStart (`c`) → 不同
2. oldEnd (`c`) vs newEnd (`a`) → 不同
3. oldStart (`a`) vs newEnd (`a`) → 命中 → 移动 `a`
4. ...

最终实现最小 DOM 操作完成排序

---

# 🔍 和 React Diff 的对比

| 特性      | Vue         | React                  |
| ------- | ----------- | ---------------------- |
| 算法复杂度   | O(n) 双端比较   | O(n^3) → 优化为 O(n) 单向比较 |
| 是否跨层比较  | 否（同层比较）     | 否（同层）                  |
| key 的作用 | 辅助节点复用与移动判断 | 唯一标识元素，避免重渲染           |
| 是否复用节点  | 是           | 是                      |
| 是否打补丁   | 是（patch）    | 是（reconciliation）      |

---

# 🧪 性能优化建议

* **列表渲染务必加 `key`**，建议使用唯一 ID
* 避免 `v-for` 嵌套 `v-if`
* 保持节点结构稳定，避免频繁移动元素
* 更新频率高的组件可拆分成小组件复用

---

# ✅ 总结一句话

> Vue 的 Diff 算法是一种在 Virtual DOM 层进行高效比较并实现最小化 DOM 更新的双端比较算法，通过 key 精准复用节点，并避免跨层对比，从而实现性能最优的视图更新过程。

---

# 📚 延伸阅读

* [Vue2 官方源码 patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js)
* [React Diff 算法详解](https://reactjs.org/docs/reconciliation.html)
