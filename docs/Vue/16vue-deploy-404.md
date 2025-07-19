---
title: Vue 项目部署后刷新页面报 404 是什么原因？如何解决？
tags: [Vue, history模式, 部署, nginx, SPA]
---

# ❓ 问题描述

Vue 项目使用 `history` 模式部署上线后，首次访问页面一切正常，但当你 **刷新页面或手动访问子路由（如 `/login`）** 时，会出现 **404 错误**。

---

# 🧠 原因分析

Vue 是 SPA（单页应用），其特点是：

- 所有页面的入口是同一个 `index.html`
- 前端使用 JavaScript 动态控制路由切换

## ✅ 为什么 `hash` 模式没问题？

- URL 如：`http://www.xxx.com/#/login`
- `#` 之后的内容是 **前端识别用的 hash**，不会发送给服务端
- 所以服务器始终只接收到 `/` 路径，请求的是 `index.html`

## ❌ 为什么 `history` 模式会报错？

- `history` 模式中，URL 如：`http://www.xxx.com/login`
- 浏览器会直接向服务端请求 `/login`
- 服务端没有 `/login` 这个静态资源 → 返回 404

---

# 🔧 解决方案（以 nginx 为例）

## 修改 nginx 配置：

```nginx
server {
  listen       80;
  server_name  www.xxx.com;

  location / {
    root   /data/dist;
    index  index.html;

    # 关键配置：重定向所有路径到 index.html，由前端路由处理
    try_files $uri $uri/ /index.html;
  }
}
````

### ✅ 解释：

* `try_files $uri $uri/ /index.html` 表示：

  * 先查找静态资源是否存在（如 `/login` 是否是个文件或目录）
  * 若找不到，则默认返回 `index.html`
  * 然后由前端 Vue Router 处理后续路由

---

# 💡 补充说明

| 模式      | 是否会报刷新404  | 是否影响 SEO | URL 美观   |
| ------- | ---------- | -------- | -------- |
| hash    | ❌ 不会报错     | ❌ 不利 SEO | ❌ 有 #    |
| history | ✅ 会报错（需配置） | ✅ 可被爬虫收录 | ✅ URL 纯净 |

---

# 🛠️ 如果是其他部署环境

### Express（Node）服务端处理方式

```js
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
```

### Vite（预设好了）

```ts
// vite.config.js
export default defineConfig({
  base: '/',
  // build时自动配置 SPA fallback，不用额外配置
});
```

---

# ✅ 总结一句话

> history 模式下，刷新子路由路径时，浏览器会向服务端请求对应地址，如果服务端未做 fallback 到 `index.html`，就会 404，因此必须通过 nginx 的 `try_files` 或 Express 的 `fallback` 实现将所有路由交由前端控制。
