---
title: CSS中的选择器类型与优先级解析
description: 本文介绍了CSS中常见的选择器类型、用法及其优先级计算规则，帮助你系统掌握样式冲突的处理逻辑。
tags: [CSS, 选择器, 优先级, 面试]
---

# CSS中的选择器有哪些？说说优先级

## 一、选择器的作用

在 CSS 中，**选择器（Selector）** 用于匹配 HTML 文档中的元素，进而对这些元素应用样式。

## 二、常见的选择器类型

| 类型 | 示例 | 说明 |
|------|------|------|
| 元素选择器（Element） | `p` | 选中所有 `<p>` 元素 |
| 类选择器（Class） | `.btn` | 选中所有 class 为 `btn` 的元素 |
| ID 选择器（ID） | `#app` | 选中 id 为 `app` 的唯一元素 |
| 属性选择器（Attribute） | `[type="text"]` | 选中具有 `type="text"` 的元素 |
| 后代选择器（Descendant） | `div p` | 选中 `div` 内所有 `<p>` 元素 |
| 子选择器（Child） | `ul > li` | 选中 `ul` 的直接子元素 `li` |
| 相邻兄弟选择器（Adjacent） | `h1 + p` | 选中紧随 `h1` 之后的第一个 `p` |
| 通用选择器（Universal） | `*` | 匹配所有元素 |
| 伪类选择器（Pseudo-class） | `a:hover` | 匹配鼠标悬停的 `<a>` 元素 |
| 伪元素选择器（Pseudo-element） | `p::before` | 匹配 `<p>` 元素前插入的内容 |

---

## 三、CSS 优先级（Specificity）

当多个选择器匹配同一个元素时，浏览器根据“优先级”规则来决定使用哪一条规则。

优先级从高到低为：

1. `!important`（最高）
2. 内联样式（如：`style="..."`）
3. ID选择器
4. 类、属性、伪类选择器
5. 元素、伪元素选择器
6. 通配符、组合选择器（如：后代、子元素选择器本身不加分）

> 常见记忆口诀：
```text
!important > 内联 > #ID > .class, [attr], :hover > 标签
```

---

## 四、优先级示例说明

```html
<div id="app" class="box" style="color: red;"></div>
```

```css
div { color: black; }                     /* specificity: 0,0,0,1 */
.box { color: blue; }                     /* specificity: 0,0,1,0 */
#app { color: green; }                    /* specificity: 0,1,0,0 */
div[style] { color: yellow !important; }  /* specificity: 0,0,1,1 + !important */
```

**最终渲染颜色为：yellow**

> 原因：`!important` 优先，其次是内联样式，然后才是选择器得分。

---

## 五、特殊情况与注意点

* 多个选择器组合时，其优先级会叠加计算。
* 出现优先级相同的情况时，**后声明的样式覆盖前者**（就近原则）。
* 使用 `!important` 可强制生效，但应慎用，避免难以维护的冲突。
* CSS-in-JS 或 BEM 命名法可有效减少优先级冲突。

---

## 六、面试延伸问题
### ❓ 1. 你能手写一个同时使用 ID、类名、伪类的选择器并说出其优先级吗？

当然可以。来看这个选择器：

```css
#app .card:hover {
  background-color: lightblue;
}
```

* `#app` 是一个 **ID 选择器**（优先级 100）
* `.card` 是一个 **类选择器**（优先级 10）
* `:hover` 是一个 **伪类选择器**（优先级 10）

✅ **总优先级为：100 + 10 + 10 = 120**

CSS 优先级计算规则为：
`[内联样式(1000), ID(100), 类/属性/伪类(10), 标签/伪元素(1)]`

---

### ❓ 2. 如何覆盖一个三方库中的样式？

覆盖三方库的样式，可以通过以下几种方式：

#### ✅ 方法 1：提高选择器优先级

```css
/* 三方库样式 */
.btn { color: gray; }

/* 自定义样式 */
.my-component .btn {
  color: red;
}
```

#### ✅ 方法 2：使用更“具体”的结构选择器

```css
/* 更长的选择器链来提高权重 */
body .container .my-wrapper .btn {
  color: red;
}
```

#### ✅ 方法 3：使用 `::v-deep`（Vue scoped 样式场景）

```css
/* Scoped 样式中 */
::v-deep .btn {
  color: red;
}
```

#### ✅ 方法 4：最后手段 —— 使用 `!important`（不推荐）

```css
.btn {
  color: red !important;
}
```

---

### ❓ 3. 哪些方法可以避免使用 `!important` 的同时保证样式生效？

以下方法都能提升样式权重，**避免滥用 `!important`**：

#### 🔹 提高选择器优先级

通过增加 `ID`、类或父选择器层级来提升优先级：

```css
/* 比如： */
#app .btn {
  color: red;
}
```

#### 🔹 避免样式冲突

确保样式不被覆盖，比如写在组件样式的最后或使用模块化 CSS（如 CSS Modules、scoped）。

#### 🔹 使用 CSS Modules / BEM 命名规范

通过命名方式（如 `block__element--modifier`）来隔离样式作用范围，减少优先级冲突。

```css
/* 使用 BEM 命名规范 */
.card__button--primary {
  color: red;
}
```

#### 🔹 使用 `style` 标签写在页面尾部（权重叠加 + 加载顺序）

在 HTML 页面中，靠后加载的样式会覆盖前面的：

```html
<style>
  .btn {
    color: red;
  }
</style>
```

#### 🔹 使用 CSS-in-JS（如 styled-components）

在 React 等框架中，可以通过样式注入的方式自动提升优先级。