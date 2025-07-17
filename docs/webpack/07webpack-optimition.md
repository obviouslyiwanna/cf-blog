---
title: 如何通过 Webpack 优化前端性能？
description: 本文全面讲解如何利用 Webpack 提供的配置项与插件手段，从体积优化、加载优化等方面提升前端性能，打造高效的前端工程。
tags: [Webpack, 前端性能优化, Tree Shaking, 代码分离, 构建优化]
---

# 如何通过 Webpack 优化前端性能？

Webpack 除了作为前端构建工具，其强大的插件系统和模块机制也为性能优化提供了丰富手段。无论是**减少文件体积**、**加快加载速度**，还是**提升运行时效率**，Webpack 都能发挥关键作用。

以下是常见的 Webpack 性能优化策略。

---

## 一、JS 代码压缩（Terser）

Webpack 默认使用 [Terser](https://github.com/terser/terser) 插件对 JS 代码进行压缩处理：

- 删除空格、注释
- 丑化变量名
- 消除不可达代码（配合 Tree Shaking）

```js
// webpack.config.js
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true, // 去除 console
        },
      },
    }),
  ],
}
````

---

## 二、CSS 压缩

通过 `css-minimizer-webpack-plugin` 进行 CSS 的压缩，移除空格、格式、重复定义等：

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

optimization: {
  minimizer: [
    new CssMinimizerPlugin()
  ]
}
```

---

## 三、HTML 文件压缩

利用 `HtmlWebpackPlugin` 插件生成 HTML 文件时配置 `minify` 参数：

```js
new HtmlWebpackPlugin({
  template: './src/index.html',
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
  }
});
```

---

## 四、图片优化

图片通常是页面中体积最大的静态资源，Webpack 可以通过 `image-webpack-loader` 等插件优化：

```js
{
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [
    {
      loader: 'file-loader',
    },
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: { progressive: true },
        optipng: { enabled: true },
        gifsicle: { interlaced: false },
        webp: { quality: 75 }
      },
    },
  ],
}
```

---

## 五、Tree Shaking（去除无用代码）

Tree Shaking 利用 **ES Module 的静态结构特性**，剔除未使用的代码：

### 1. 使用 `usedExports`

```js
// webpack.config.js
optimization: {
  usedExports: true
}
```

Webpack 会标记模块哪些函数没有被使用，交由 Terser 剔除。

### 2. 使用 `sideEffects`

在 `package.json` 中配置：

```json
"sideEffects": false
```

标识模块文件**无副作用**，可以整体被删除。也可单独配置：

```json
"sideEffects": ["*.css"]
```

---

## 六、CSS Tree Shaking（移除未使用的 CSS）

可借助 `purgecss-webpack-plugin`：

```js
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
new PurgeCSSPlugin({
  paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
});
```

---

## 七、代码分离（Code Splitting）

将不同业务代码、第三方依赖、运行时代码拆分成不同 bundle，按需加载：

```js
optimization: {
  splitChunks: {
    chunks: 'all',
  },
},
```

还可以配合 `import()` 实现 **懒加载**：

```js
import('lodash').then(_ => {
  // do something
});
```

---

## 八、内联 Runtime Chunk

通过 `InlineChunkHtmlPlugin` 插件，将 runtime 代码内联至 HTML，减少请求：

```js
new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/])
```

runtime 是 Webpack 在模块间加载、管理的核心逻辑，通常体积较小，内联可减少请求次数。

---

## 九、Gzip 压缩

通过 `compression-webpack-plugin` 插件启用 Gzip 输出：

```js
const CompressionPlugin = require('compression-webpack-plugin');

new CompressionPlugin({
  algorithm: 'gzip',
  test: /\.(js|css|html|svg)$/,
});
```

服务器需支持 Gzip 响应头。

---

## 十、持久化缓存优化

配置 `filename` 使用 `contenthash`，使资源内容不变时缓存有效：

```js
output: {
  filename: '[name].[contenthash].js',
}
```

---

## 总结一张表

| 优化手段             | 目的           | 插件/方式                     |
| ---------------- | ------------ | ------------------------- |
| JS 压缩            | 减小 bundle 大小 | TerserPlugin              |
| CSS 压缩           | 减小样式文件体积     | CssMinimizerPlugin        |
| 图片压缩             | 降低图像体积       | image-webpack-loader      |
| Tree Shaking     | 去除无用代码       | usedExports / sideEffects |
| CSS Tree Shaking | 移除未使用样式      | PurgeCSSPlugin            |
| 代码分离             | 实现懒加载与并发加载   | SplitChunksPlugin         |
| 内联 Runtime       | 减少关键路径请求     | InlineChunkHtmlPlugin     |
| Gzip 压缩          | 减小传输体积       | CompressionWebpackPlugin  |
| 缓存优化             | 浏览器缓存复用      | contenthash               |

---

## 📌 推荐阅读

* [官方文档：优化构建输出](https://webpack.js.org/guides/production/)
* [webpack性能优化最佳实践指南](https://webpack.js.org/guides/build-performance/)
