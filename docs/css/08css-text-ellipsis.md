---
slug: css-text-ellipsis
title: 如何实现单行与多行文本溢出显示省略号？
description: 本文总结了单行和多行文本在 CSS 中实现文本溢出省略号的几种方式，适用于固定宽度或限定行数场景。
tags: [CSS, 文本溢出, 省略号, 单行截断, 多行截断, UI优化]
---

在前端开发中，我们常常遇到需要限制文本显示长度并以省略号 `...` 的方式展现溢出内容的情况。

可以分为两类：

## ✂️ 一、单行文本溢出显示省略号

### ✅ 核心属性组合

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

### ✅ 示例

```html
<div class="single-line">这是很长很长的单行文本内容，希望尾部被省略显示</div>
```

```css
.single-line {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 📚 二、多行文本溢出显示省略号

### 方法一：基于 **高度** 的截断（兼容性好）

> 适合文本块有固定高度和 `line-height`，显示特定行数后省略

### ✅ 核心思路

* 使用 `position: relative` 和 `::after` 插入省略号
* 控制 `height` 和 `line-height` 限制行数
* 设置 `overflow: hidden` 截断文本

### ✅ 示例代码

```html
<div class="multi-line-ellipsis-height">多行文本溢出处理，多行文本溢出处理，多行文本溢出处理...</div>
```

```css
.multi-line-ellipsis-height {
  position: relative;
  width: 200px;
  height: 40px; /* 两行高度 */
  line-height: 20px;
  overflow: hidden;
}

.multi-line-ellipsis-height::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  padding-left: 10px;
}
```

---

### 方法二：基于 **行数** 的 `-webkit-line-clamp`（现代浏览器）

> 适用于现代 WebKit 内核的浏览器，简单语法即可实现多行省略

### ✅ 核心属性

```css
display: -webkit-box;
-webkit-line-clamp: 2; /* 限定最多显示2行 */
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
```

### ✅ 示例代码

```html
<div class="multi-line-ellipsis-clamp">
  这是多行文本，文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
</div>
```

```css
.multi-line-ellipsis-clamp {
  width: 200px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

> 💡 注意：`-webkit-line-clamp` 是非标准属性，需测试兼容性，主流移动端浏览器支持良好。

---

## ✅ 总结

| 场景       | 方法                                                | 兼容性     | 优势        |
| -------- | ------------------------------------------------- | ------- | --------- |
| 单行省略     | `white-space: nowrap` + `text-overflow: ellipsis` | 所有主流浏览器 | 简洁        |
| 多行省略（高度） | `::after` + `height + line-height`                | 所有主流浏览器 | 可定制性高     |
| 多行省略（行数） | `-webkit-line-clamp`                              | 现代浏览器   | 语义清晰，代码简洁 |

---

### ✅ 附加推荐

如果你在使用 TailwindCSS，可以用以下实用插件：

```bash
npm install @tailwindcss/line-clamp
````

然后在 `tailwind.config.js` 中引入：

```js
plugins: [
  require('@tailwindcss/line-clamp'),
],
```

使用方式：

```html
<p class="line-clamp-3">省略3行后的内容</p>
```
