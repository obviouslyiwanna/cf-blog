```
Q   HTML5 中 <!DOCTYPE html> 的作用是什么？为什么它能触发标准模式而不是怪异模式？
```
A   它是一个文档类型声明（Document Type Declaration, DTD），告诉浏览器使用 HTML5 解析器来解析文档。
    在 HTML5 中，它告诉浏览器：按照 HTML5 标准来解析文档（标准模式 / Standard Mode）。

    如果不写或写错，浏览器可能会进入 怪异模式（Quirks Mode），用旧的、不兼容的渲染方式解析页面，导致 CSS、布局等表现异常。

    HTML5 的声明很简短，没有像 HTML4 那样长的 DTD，因为 HTML5 不再基于 SGML，不需要复杂的文档声明，只是一个触发标准模式的标志。

    *可以把它理解为：这是浏览器的“渲染模式开关”，开在标准模式时，CSS 盒模型、JS 行为都更符合现代规范。
```
Q   请说一下 标准盒模型 和 IE 盒模型 的区别，以及如何用 CSS 切换两者。
```
A   - 标准盒模型（content-box，默认）

    width / height 只包含 内容（content） 的宽高。

    元素的实际占用空间 = content + padding + border（不含 margin）。

    - IE 盒模型（border-box）

    width / height 包含 内容（content） + 内边距（padding） + 边框（border）。

    元素的实际占用空间 = width / height（已经包含 padding 和 border）。

    - 如何切换盒模型

    标准盒模型：

    ```css
    box-sizing: content-box;
    ```

    IE 盒模型：

    ```css
    box-sizing: border-box;
    ```
    - 现在大部分UI框架会全局设置
    ```css
    *, *::before, *::after {
       box-sizing: border-box;
    }
    ```
    这样更容易做响应式布局，因为加 padding/border 不会撑大盒子。

```
Q 
```