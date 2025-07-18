---
slug: css-parallax-scrolling
title: 如何使用 CSS 实现视差滚动（Parallax Scrolling）效果？
description: CSS 实现视差滚动效果主要依赖 background-attachment 与 transform/perspective 等属性，模拟多层背景不同速率移动，增强空间感。
tags: [CSS, 视差滚动, Parallax, transform, background-attachment, 页面动画]
---

视差滚动（Parallax Scrolling）是一种网页视觉特效，通常是让背景元素滚动速度慢于前景内容，从而营造出立体的动态感。

---

## 🧩 方法一：使用 `background-attachment: fixed`

### ✅ 原理

当背景设置为 `fixed`，它会相对于**视口**固定，而不是随着内容滚动，因此形成前后景速度差异。

### ✅ 示例

```html
<section class="parallax-section">
  <h1>Welcome to the Parallax World</h1>
</section>
```

```css
.parallax-section {
  height: 100vh;
  background-image: url('your-image.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}
```

> 💡 注意事项：
>
> * `background-attachment: fixed` 在移动端兼容性较差（如 iOS Safari）。
> * 可使用 `@media` 限定在桌面端使用此方式。

---

## 🧩 方法二：结合 `transform: translateZ()` + `perspective` 实现 3D 视差

### ✅ 原理

通过设置多个层的 `transform: translateZ()` 以及 `scale()` 来模拟远近不同的视差滚动。

### ✅ 示例结构

```html
<div class="parallax-container">
  <div class="parallax-layer back"></div>
  <div class="parallax-layer middle"></div>
  <div class="parallax-layer front"></div>
</div>
```

```css
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  transform-style: preserve-3d;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: center;
  background-size: cover;
  background-position: center;
}

.back {
  background-image: url('bg.jpg');
  transform: translateZ(-2px) scale(3);
  z-index: 1;
}

.middle {
  background-image: url('mid.png');
  transform: translateZ(-1px) scale(2);
  z-index: 2;
}

.front {
  background-image: url('front.png');
  transform: translateZ(0px) scale(1);
  z-index: 3;
}
```

> ⚠️ 注意：
>
> * 需要搭配 JavaScript 或额外结构，才能让滚动带动多个图层出现位移差异。
> * `translateZ` + `scale` 是模拟远近感的关键。
> * `perspective` 作用于外层容器。

---

## ✅ 实用场景与提示

* 🔷 Banner 区域背景视差增强视觉冲击力
* 🔷 产品详情页配合滚动解说效果
* 🔷 营造“沉浸式体验”网站如游戏/品牌展示页
* ✅ 注意性能和移动端适配：建议适度使用，不建议整页多个大图同时使用视差

---

## 📦 延伸阅读

* JS 实现视差效果推荐：[`rellax.js`](https://dixonandmoe.com/rellax/)
* 高性能视差库：[`locomotive-scroll`](https://locomotivemtl.github.io/locomotive-scroll/)
* Tailwind 插件实现视差：使用 `@tailwindcss/aspect-ratio` + 自定义 `transform` 实现部分效果

---

## 📝 总结

| 方法                     | 技术点     | 优势      | 局限        |
| ---------------------- | ------- | ------- | --------- |
| background-attachment  | CSS原生属性 | 简单易用    | 移动端兼容差    |
| transform + translateZ | 3D 视觉效果 | 可控制层级远近 | 结构稍复杂，需调试 |
| JS 配合 scroll 事件        | 动态计算    | 可自定义逻辑  | 性能优化要做足   |

视差滚动是一种极具表现力的网页动画技术，如果只使用纯 CSS，也能完成不少视觉效果！
