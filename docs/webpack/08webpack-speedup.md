---
title: 如何提升 Webpack 构建速度？
description: 本文总结了提高 Webpack 构建速度的常见手段，包括 loader 配置优化、模块解析提速、缓存策略、多线程并行等关键技术。
tags: [Webpack, 构建优化, 性能提升, loader优化, 缓存加速]
---

# 如何提升 Webpack 构建速度？

Webpack 功能强大，但在大型项目中构建速度慢的问题常见。通过合理配置，可以显著提升开发时和生产环境下的构建效率。

下面从多个角度归纳 Webpack 构建提速的实用手段。

---

## 一、优化 Loader 配置

### 1. 使用 `include` 和 `exclude`

限制 Loader 的处理范围，避免对不必要的文件执行转换：

```js
{
  test: /\.js$/,
  use: 'babel-loader',
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/
}
````

### 2. 使用 `cache-loader` 缓存 Loader 结果

对性能开销较大的 loader（如 Babel）加缓存，避免重复编译：

```js
{
  test: /\.js$/,
  use: ['cache-loader', 'babel-loader'],
  include: path.resolve(__dirname, 'src')
}
```

> ✅ 只对重编译成本高的 loader 使用 `cache-loader`，否则缓存本身会产生 IO 开销。

---

## 二、优化模块解析（resolve）

### 1. 精简 `resolve.extensions`

Webpack 解析模块时会尝试每个扩展名，合理配置可减少尝试次数：

```js
resolve: {
  extensions: ['.js', '.json'] // 移除不必要的 .jsx、.ts 等
}
```

### 2. 指定 `resolve.modules`

默认模块查找路径为 `['node_modules']`，可添加绝对路径减少递归查找：

```js
resolve: {
  modules: [path.resolve(__dirname, 'node_modules')]
}
```

### 3. 使用 `resolve.alias` 减少深层路径解析

别名可加速路径匹配，特别是目录结构较深时：

```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src/')
  }
}
```

---

## 三、使用 DLLPlugin 加速二次构建

将第三方库提前打包为动态链接库（DLL），提升主项目构建速度：

### 1. 生成 DLL：

```js
new webpack.DllPlugin({
  path: path.join(__dirname, '[name]-manifest.json'),
  name: '[name]_library'
})
```

### 2. 引入 DLL：

```js
new webpack.DllReferencePlugin({
  manifest: require('./dist/vendor-manifest.json')
});
```

> 适用于依赖更新频率低的公共库（如 vue、react、lodash 等）。

---

## 四、开启多线程构建

### 1. 多进程压缩 JS：`TerserWebpackPlugin`

```js
optimization: {
  minimize: true,
  minimizer: [
    new TerserWebpackPlugin({
      parallel: true // 多线程压缩
    })
  ]
}
```

### 2. 使用 `thread-loader`

将耗时 loader 放入子线程中并发处理：

```js
{
  test: /\.js$/,
  use: ['thread-loader', 'babel-loader']
}
```

> 第一次构建会慢一点，适合大项目。

---

## 五、优化 Source Map

SourceMap 越详细，构建越慢。开发环境可选择性能与调试的平衡：

```js
devtool: 'cheap-module-source-map' // 推荐开发环境使用
```

常见 devtool 类型比较：

| 类型                        | 构建速度  | 错误提示精准度 | 是否生成 source map 文件 |
| ------------------------- | ----- | ------- | ------------------ |
| `eval`                    | ★★★★★ | 差       | 否                  |
| `eval-source-map`         | ★★★★☆ | 好       | 否                  |
| `cheap-module-source-map` | ★★★☆☆ | 较好      | 是                  |
| `source-map`              | ★★☆☆☆ | 最好      | 是                  |

---

## 六、减少模块数量

### 1. 使用 `noParse`

不解析某些库中的依赖关系，如大型 UMD 库（例如 jquery、moment）：

```js
module: {
  noParse: /jquery|lodash/
}
```

### 2. 拆包优化

减少首屏需要加载的模块数量，配合 `SplitChunksPlugin` 拆分代码。

---

## 七、关闭性能提示

构建时关闭性能提示，加快编译：

```js
performance: {
  hints: false
}
```

---

## 总结

| 优化方式            | 技术点                           |
| --------------- | ----------------------------- |
| 减少 loader 范围    | include/exclude、cache-loader  |
| 提升模块查找速度        | extensions、modules、alias      |
| 加速构建公共依赖        | DllPlugin                     |
| 并行处理任务          | thread-loader、terser.parallel |
| 精简 sourceMap 配置 | devtool: cheap/none           |
| 减少模块/依赖         | noParse、SplitChunksPlugin     |

---

## 📌 推荐插件列表

| 插件名                     | 用途说明              |
| ----------------------- | ----------------- |
| `cache-loader`          | 缓存 loader 输出结果    |
| `thread-loader`         | 多线程构建 JS 模块       |
| `terser-webpack-plugin` | 多进程压缩代码           |
| `DllPlugin`             | 预编译不变依赖，提高主项目构建速度 |

---

## 📚 延伸阅读

* [Webpack 官方构建优化指南](https://webpack.js.org/guides/build-performance/)
* [Webpack 性能优化白皮书](https://web.dev/performance-scoring/)
