---
title: Loader 和 Plugin 的区别与编写思路
description: 本文对比 Webpack 中 Loader 与 Plugin 的本质差异，并详细介绍如何自定义实现一个 Loader 与 Plugin 的基本步骤与规范。
tags: [Webpack, Loader, Plugin, 构建工具, 前端工程化]
---

# Loader 和 Plugin 的区别与编写思路

在 Webpack 构建体系中，`Loader` 与 `Plugin` 是两个非常重要的扩展机制，它们承担着不同的职责，解决不同层次的问题。理解两者的本质区别及其适用场景，有助于我们编写更加高效、灵活的构建配置，甚至实现自定义的构建逻辑。

---

## 一、Loader vs Plugin 的区别

| 对比项 | Loader | Plugin |
|--------|--------|--------|
| 本质 | 模块转换器（transformer） | 构建流程扩展器（lifecycle hook） |
| 操作对象 | 单个文件模块（如 `.js`、`.css`、`.less`） | 整个构建流程 |
| 运行时机 | 模块加载前（loader-chain） | 构建生命周期中（compile、emit 等阶段） |
| 使用方式 | 配置于 `module.rules` 中 | 配置于 `plugins` 数组中 |
| 示例 | `babel-loader`、`css-loader` | `HtmlWebpackPlugin`、`DefinePlugin` |
| 能力范围 | 文件内容的编译、转换等 | 打包优化、资源管理、环境变量注入等 |
| 是否可链式调用 | ✅（从右往左） | ❌（执行顺序受生命周期控制） |

👉 总结一句话：**Loader 是资源级别的预处理器，Plugin 是构建流程级别的参与者。**

---

## 二、如何编写一个自定义 Loader？

### 1. Loader 是什么？

本质上，Loader 就是一个函数，它接收源文件内容作为参数，返回转换后的内容（或通过 `this.callback` 异步返回）。

```js
// my-loader.js
module.exports = function(source) {
  const content = doSomething(source);

  // 如果是异步 loader
  this.callback(null, content);

  // 同步也可以直接 return
  // return content;
};
```

### 2. 编写要点

* Loader 函数不能是箭头函数，因为需要访问 `this`（由 Webpack 注入）。
* `this.query` 可读取 loader 的配置项（如果有传入 options）。
* 支持异步处理（通过 `this.async()` 或 `this.callback()`）。
* 保持功能单一，便于组合成 loader chain。

### 3. 示例场景：自定义 markdown 转 HTML 的 loader

```js
const marked = require('marked');

module.exports = function(source) {
  const html = marked(source);
  return `export default ${JSON.stringify(html)}`;
};
```

---

## 三、如何编写一个自定义 Plugin？

### 1. Plugin 是什么？

本质上，Plugin 是一个带有 `apply(compiler)` 方法的类，通过监听 Webpack 构建生命周期中的事件钩子（Hooks），插入自定义逻辑。

### 2. 编写规范

* 必须是一个类，提供 `apply` 方法。
* 在 `apply` 方法中注册感兴趣的生命周期钩子。
* 可通过 `compiler` 与 `compilation` 获取当前构建上下文。
* 若为异步插件，需调用回调通知 Webpack。

### 3. 示例模板

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // emit 事件代表资源已处理完，即将输出
      for (const filename in compilation.assets) {
        console.log(`Processing: ${filename}`);
      }
    });
  }
}
```

### 4. 常用生命周期钩子（部分）

| 钩子名           | 说明                    |
| ------------- | --------------------- |
| `entryOption` | 初始化配置                 |
| `run`         | 开始编译                  |
| `compile`     | 编译前触发                 |
| `compilation` | 创建 compilation 对象     |
| `make`        | 从 entry 开始递归构建模块      |
| `emit`        | 输出 asset 到硬盘前，常用于修改文件 |
| `done`        | 编译完成                  |

---

## 四、总结

| 特性   | Loader      | Plugin                 |
| ---- | ----------- | ---------------------- |
| 操作粒度 | 单个资源文件      | 构建过程全局                 |
| 设计目标 | 模块内容预处理     | 构建流程扩展与增强              |
| 编写方式 | 导出函数        | 定义类，注册到 compiler.hooks |
| 常用场景 | 处理样式、图片、语法等 | 自动生成 HTML、清除目录、压缩代码    |

---

## 参考资源

* [Webpack 官方文档：Loader](https://webpack.js.org/concepts/loaders/)
* [Webpack 官方文档：Plugin](https://webpack.js.org/contribute/writing-a-plugin/)
* [Tapable 源码与生命周期机制](https://github.com/webpack/tapable)

