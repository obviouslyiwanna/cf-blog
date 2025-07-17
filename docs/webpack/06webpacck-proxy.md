---
title: Webpack Proxy 工作原理与跨域解决方案
description: 本文深入讲解 webpack-dev-server 中的 proxy 是如何工作的、如何配置代理服务器，以及它是如何帮助开发环境中解决跨域问题的。
tags: [Webpack, Proxy, 跨域, 前端工程化, 开发环境]
---

# Webpack Proxy 工作原理与跨域解决方案

在前端开发中，我们经常会遇到**浏览器的跨域限制**。为了解决开发环境下跨域请求的问题，Webpack 提供了 `devServer.proxy` 配置来设置代理中间层。这篇文章将详细讲解其 **工作原理、配置方法及背后的技术基础**。

---

## 一、什么是 Webpack Proxy？

`webpack-dev-server` 内置了一个**中间代理服务器**，用于将前端请求转发到后端接口，避免直接由浏览器发起跨域请求。

例如：

```bash
浏览器请求：http://localhost:8080/api/user
实际代理到： http://api.example.com/user
````

这项功能通过配置 `devServer.proxy` 实现，常用于开发阶段模拟生产环境请求接口。

---

## 二、跨域的由来

浏览器出于安全考虑，启用了**同源策略**（Same-Origin Policy），禁止一个域的网页去请求另一个域的资源。

例如：

```bash
前端：http://localhost:8080
后端：http://api.example.com
```

默认情况下，浏览器会**阻止这种跨域请求**。但在开发阶段，我们并不想每次都让后端处理跨域，代理就能很好地解决这个问题。

---

## 三、Webpack Proxy 的工作原理

Webpack Proxy 本质上是通过 `http-proxy-middleware` 实现的一个 **中间层 HTTP 转发服务**。

> 它将浏览器原本的跨域请求“劫持”，先发给本地 Dev Server，由 Dev Server 代理后转发给目标服务器，这样浏览器就不会认为是跨域了。

📌 **工作流程图：**

```text
[Browser] ---> [Webpack Dev Server (proxy)] ---> [Backend API Server]
```

浏览器 → 请求 localhost:8080/api/user
Webpack Dev Server → 拦截 `/api/*` 请求 → 转发至 [http://api.example.com/user](http://api.example.com/user)
Webpack Dev Server → 接收响应 → 返回给浏览器

由于一切都是发生在服务器之间，浏览器始终只和 `localhost` 通信，因此**不会触发跨域限制**。

---

## 四、代理配置示例

```js
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.example.com', // 代理目标地址
        pathRewrite: { '^/api': '' }, // 重写路径
        secure: false, // 支持 https
        changeOrigin: true, // 修改请求头中的 origin
      }
    }
  }
};
```

📌 各配置参数说明：

| 参数             | 说明                                          |
| -------------- | ------------------------------------------- |
| `target`       | 要代理到的服务地址                                   |
| `pathRewrite`  | 重写路径，通常用来去掉路径前缀（如 `/api`）                   |
| `secure`       | 是否验证 SSL 证书，默认 `true`，改为 `false` 可用于代理自签名证书 |
| `changeOrigin` | 是否修改请求头中的 `Host` 字段，通常设置为 `true` 避免被后端拦截    |

---

## 五、原理关键：`http-proxy-middleware`

Webpack Proxy 的底层依赖库是 [`http-proxy-middleware`](https://github.com/chimurai/http-proxy-middleware)，它是一个基于 Express 的中间件框架，用于处理 HTTP 请求代理。

你也可以在 Node.js 项目中单独使用这个库：

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api', createProxyMiddleware({
  target: 'http://api.example.com',
  changeOrigin: true,
}));
```

---

## 六、常见使用场景

* 本地开发时将接口请求代理到远程测试环境或本地 mock 服务器；
* 多端开发（前端、后端分离）时快速联调；
* 避免频繁设置 CORS 响应头；
* 快速调试第三方接口；

---

## 七、总结

| 特性 | 说明                                   |
| -- | ------------------------------------ |
| 原理 | Webpack Dev Server 搭建中间代理服务器，拦截并转发请求 |
| 优点 | 无需设置 CORS，开发体验良好，配置灵活                |
| 局限 | 仅在开发阶段使用，生产环境建议由 Nginx 或 API 网关代理    |

---

## 📌 延伸阅读

* [Webpack 官方文档 - devServer.proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy)
* [http-proxy-middleware GitHub](https://github.com/chimurai/http-proxy-middleware)
