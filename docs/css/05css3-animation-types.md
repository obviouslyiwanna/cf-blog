---
slug: css3-animation-types
title: CSS3 动画有哪些？
authors: kaykay
tags: [CSS, 动画, transition, transform, animation]
---

CSS3 动画为网页带来了更多交互与视觉体验，能让元素从一种状态**平滑地过渡**到另一种状态。常见的动画效果包括平移、旋转、缩放、倾斜等，这些动画可以单独使用，也可以组合形成更复杂的动画序列。

本文总结 CSS3 中三种主要动画实现方式：`transition`、`transform` 和 `animation`。

---

## 一、transition：过渡动画

`transition` 让元素在两个状态之间平滑过渡，通常用于 hover 或点击交互。

### 属性说明：

- `transition-property`：需要变化的 CSS 属性
- `transition-duration`：完成动画的时长（单位：s 或 ms）
- `transition-timing-function`：速度曲线（如 `ease-in`、`linear`、`ease-in-out`）
- `transition-delay`：动画延迟开始的时间

### 示例：

```html
<style>
.base {
  width: 100px;
  height: 100px;
  background-color: #0EA9FF;
  border: 5px solid #5daf34;

  transition-property: width, height, background-color, border-width;
  transition-duration: 2s;
  transition-timing-function: ease-in;
  transition-delay: 500ms;
}

.base:hover {
  width: 200px;
  height: 200px;
  background-color: #5daf34;
  border-width: 10px;
  border-color: #3a8ee6;
}
</style>

<div class="base"></div>
```

也可以简写成：

```css
transition: all 2s ease-in 500ms;
```

---

## 二、transform：变换动画

`transform` 提供图形变换功能，包括：

* `translate(x, y)`：平移
* `scale(x, y)`：缩放
* `rotate(deg)`：旋转
* `skew(x, y)`：倾斜

> ⚠️ `transform` 不支持 inline 元素，需将元素设置为 `block` 或 `inline-block`

### 示例：

```html
<style>
.base {
  width: 100px;
  height: 100px;
  display: inline-block;
  background-color: #0EA9FF;
  border: 5px solid #5daf34;
  transition: transform 2s ease-in;
}

.base:hover {
  transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
}
</style>

<div class="base"></div>
```

---

## 三、animation：关键帧动画

`animation` 允许我们创建更复杂、更控制精细的动画过程。它由多个属性组合构成，通常与 `@keyframes` 搭配使用。

### animation 属性包含：

* `animation-name`
* `animation-duration`
* `animation-timing-function`
* `animation-delay`
* `animation-iteration-count`
* `animation-direction`
* `animation-fill-mode`
* `animation-play-state`

可简写为：

```css
animation: fadeIn 2s ease-in-out 0s 1 normal forwards;
```

### 示例：元素旋转

```html
<style>
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.box {
  width: 100px;
  height: 100px;
  background-color: #0EA9FF;
  animation: rotate360 3s linear infinite;
}
</style>

<div class="box"></div>
```

---

## 对比三种动画方式：

| 方式           | 特点与用途                    | 是否可控多个阶段 | 是否支持复杂动画 | 常用于                |
| ------------ | ------------------------ | -------- | -------- | ------------------ |
| `transition` | 适用于简单状态切换（如 hover）       | ❌        | ❌        | 交互反馈               |
| `transform`  | 本身不产生动画，常与 transition 配合 | ❌        | ❌        | 旋转、缩放              |
| `animation`  | 支持完整控制动画过程（关键帧）          | ✅        | ✅        | Loading、Banner 动效等 |

---

## 总结

CSS3 提供了非常强大的动画能力，配合 HTML 和 JavaScript 可以实现丰富的前端动效。推荐优先使用 CSS 动画替代 JS 动画以获得更好的性能和更简洁的代码。

* 简单过渡用 `transition`
* 几何变换用 `transform`
* 连贯复杂动画用 `animation + keyframes`

掌握这三种动画能力，是构建交互友好、体验流畅的现代 Web 页面的基础。
