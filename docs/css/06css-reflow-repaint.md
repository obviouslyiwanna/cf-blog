---
slug: css-reflow-repaint
title: 如何理解回流与重绘？什么场景下会触发？
authors: kaykay
tags: [CSS, 回流, 重绘, 渲染性能, 优化]
---

在浏览器的渲染流程中，**回流（Reflow）与重绘（Repaint）** 是两个非常重要的概念，直接影响页面的性能表现。

## 一、什么是回流与重绘？

在 HTML 中，每个元素可以理解为一个盒子，浏览器通过解析 DOM 和 CSSOM 构建渲染树并进行布局与绘制：

- **回流（Reflow）**：又称重排，指的是浏览器重新计算 DOM 元素的几何位置（大小、位置等）。例如：宽度、高度、内边距、外边距、边框、定位变化等。
- **重绘（Repaint）**：在确定盒子大小与位置后，浏览器会将其绘制到页面上。涉及到颜色、字体、阴影、透明度等视觉样式的改变时会触发重绘。

> ✅ 回流必定会触发重绘，而重绘不一定会回流。

---

## 二、哪些操作会触发回流？

以下操作会导致回流（重排）：

- DOM 节点的添加或删除
- 元素位置或尺寸的变化（`width`, `height`, `top`, `left` 等）
- 内容尺寸变化（如文字变多）
- 浏览器窗口大小变化（resize）
- 修改元素的 display、position、float、overflow 属性
- 获取 layout 属性，如 `offsetTop`, `offsetHeight`, `getComputedStyle()` 等（会触发强制同步回流）

## 三、哪些操作会触发重绘？

重绘主要与视觉外观相关，以下样式变化会触发重绘：

- 改变 `color`, `background-color`, `visibility`, `border-color` 等
- 修改 `box-shadow`, `text-shadow`
- 修改透明度 `opacity`
- 修改某些非布局相关的 `transform` 值（如 `rotate`）

---

## 四、性能影响与优化策略

回流和重绘都是**高性能开销**的操作，尤其是回流，通常会影响整个渲染树。因此我们应尽量避免频繁触发。

### 1. 浏览器优化机制

现代浏览器会将多个 DOM 操作合并，使用队列统一处理，**批量更新**，减少性能开销。但某些操作（如读取布局信息）会强制刷新队列并触发回流。

例如：

```js
element.style.width = "100px";
console.log(element.offsetWidth); // 强制刷新
```

### 2. 常见优化建议

* ✅ 使用类名切换样式，而不是逐个修改样式属性
* ✅ 动画使用 `transform` 和 `opacity`，避免影响布局
* ✅ 频繁 DOM 操作时使用 `DocumentFragment`，一次性插入 DOM
* ✅ 多次样式更改前先 `display: none` 隐藏元素，修改后再显示
* ✅ 避免 `table` 布局，table 回流开销大
* ✅ 尽量减少 DOM 层级，优化选择器性能
* ✅ 合理使用 `will-change` 和 `GPU 加速`

```css
/* 硬件加速可以提升动画性能 */
.element {
  will-change: transform, opacity;
}
```

### 3. 离线操作技巧

利用 DOM 离线操作优化性能：

```js
const frag = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  frag.appendChild(li);
}
document.querySelector("ul").appendChild(frag);
```

---

## 五、总结

| 操作类型                    | 是否触发回流 | 是否触发重绘 | 示例                           |
| ----------------------- | ------ | ------ | ---------------------------- |
| 改变元素尺寸或位置               | ✅      | ✅      | `width`, `height`, `top`     |
| 改变颜色、透明度                | ❌      | ✅      | `color`, `opacity`           |
| 添加/删除 DOM 节点            | ✅      | ✅      | `appendChild`, `removeChild` |
| 设置 `display: none`      | ✅      | ❌      | 隐藏时不触发重绘                     |
| 设置 `visibility: hidden` | ❌      | ✅      | 元素仍占据空间                      |

掌握回流与重绘机制是优化网页性能的重要一环，尤其是在涉及动画、频繁 DOM 更新、长列表渲染等场景中尤为关键。

---