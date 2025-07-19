---
title: Vue 指令：v-show 和 v-if
tags: [Vue, 渲染, 前端]
---


# 📘 Vue 指令对比：`v-show` 与 `v-if`

在 Vue 中，控制元素的显示/隐藏常用的两个指令是 `v-show` 和 `v-if`，它们在**渲染机制、性能开销、使用场景**等方面有本质区别。

---

## 🧩 指令对比总览

| 特性     | `v-show`               | `v-if`               |
| ------ | ---------------------- | -------------------- |
| 是否渲染元素 | 渲染（DOM已存在，仅控制 display） | 条件成立时才渲染（DOM 不存在时移除） |
| DOM 开销 | 一次性渲染，频繁切换性能更优         | 每次切换都会销毁/重建 DOM      |
| 编译时表现  | 编译为 `display: none`    | 编译为条件渲染（vnode 创建/销毁） |
| 初次渲染开销 | 较小                     | 较大                   |
| 适用场景   | 高频切换场景（如 Tab、下拉面板）     | 条件成立几率较小或首次渲染控制严格时   |

---

## 🧪 工作原理对比

### 🔍 `v-show`

* 在组件的 `beforeMount` 生命周期中执行：

  * 设置 `style="display: none"` 或恢复显示
* DOM **始终渲染**在页面中，只是通过样式控制可见性
* 没有组件销毁与重建的过程

```vue
<div v-show="isVisible">显示内容</div>
```

```js
// 编译后逻辑伪代码
el.style.display = isVisible ? '' : 'none'
```

---

### 🧱 `v-if`

* 条件判断是否执行 `render()` 函数
* 控制**VNode 的创建或销毁**
* 条件为 false 时，对应的组件或元素不会被创建，已创建的会被销毁

```vue
<div v-if="isVisible">显示内容</div>
```

```js
// 编译后伪逻辑
if (isVisible) {
  createElement('div', '显示内容')
} else {
  return null
}
```

---

## 🧠 底层渲染流程（适用于 v-if）

1. **模板编译阶段**：将 template 编译为 AST（抽象语法树）
2. **生成 render 函数**：将 AST 转为 `render()` 函数 和静态节点的 `staticRenderFns`
3. **执行 render()**：生成虚拟 DOM（VNode）
4. **调用 patch()**：将 VNode 挂载为真实 DOM

```js
vm._render() → VNode → vm.__patch__() → 真实 DOM
```

---

## 💡 总结建议

* `v-if`：用于 **首次渲染开销敏感**、**数据变化频率低** 的场景
  👉 比如登录框是否显示、权限控制模块是否显示

* `v-show`：用于 **频繁切换显示/隐藏** 的场景
  👉 比如 Tab 选项卡切换、导航菜单的展开/折叠

---

## 🧬 小测试：你能分辨出下面哪个更适合用 `v-show` 吗？

```vue
<!-- 场景 A：切换 FAQ 答案显示 -->
<div v-show="faqOpen">详细答案内容</div>

<!-- 场景 B：是否展示 Admin 模块 -->
<div v-if="user.isAdmin">管理页面</div>
```

✅ 场景 A 用 `v-show`，场景 B 用 `v-if`

