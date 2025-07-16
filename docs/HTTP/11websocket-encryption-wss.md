---
title: WebSocket 如何实现加密传输（WSS）？
tags: [WebSocket, TLS, 网络安全, 前端面试]
---

## 🌐 什么是 WebSocket Secure（WSS）？

WebSocket 是一种在 **单个 TCP 连接** 上提供 **全双工通信** 的协议。但默认的 `ws://` 是**明文传输**的，不具备安全性。因此，为了保障通信过程中数据的**机密性、完整性**和**抗中间人攻击能力**，需要使用加密版本 —— **WebSocket Secure（WSS）**。

WSS 其实就是通过 **TLS（传输层安全协议）** 加持的 WebSocket，类似于 HTTPS 之于 HTTP。

---

## 🔒 加密流程详解

### ✅ 1. 协议切换

- `ws://` 表示使用 **明文传输**
- `wss://` 表示使用 **加密传输**

```ts
const socket = new WebSocket('wss://example.com/socket');
````

此时浏览器会自动发起 TLS 握手，建立安全通道。

---

### ✅ 2. TLS 握手过程（简略版）

1. 客户端发起 TLS 握手请求
2. 服务器返回数字证书（如 Let's Encrypt / Cloudflare 提供）
3. 客户端验证证书合法性（如检查域名、签名、证书链）
4. 双方协商生成对称加密的**会话密钥**
5. 成功后建立安全连接，WebSocket 握手才正式开始

---

### ✅ 3. WebSocket 握手协议（基于 HTTPS 或 WSS）

#### 📤 客户端请求

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: https://example.com
Sec-WebSocket-Version: 13
Sec-WebSocket-Protocol: chat, superchat
```

关键字段解析：

* `Upgrade: websocket`：表示希望升级为 WebSocket 协议
* `Connection: Upgrade`：协同字段，必须一起设置
* `Sec-WebSocket-Key`：Base64 编码的随机字符串，服务端返回签名验证
* `Sec-WebSocket-Version`：当前使用的协议版本，一般为 13

#### 📥 服务端响应

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
```

关键字段：

* `101 Switching Protocols`：表示协议升级成功
* `Sec-WebSocket-Accept`：基于客户端 `Sec-WebSocket-Key` + 固定 GUID 生成 SHA-1 哈希后的 Base64 编码，用于验证合法性

---

## ✅ WebSocket 的加密特性与优势

| 特性     | 说明                                   |
| ------ | ------------------------------------ |
| 加密传输   | 通过 TLS 协议实现数据的加密、认证、完整性校验            |
| 全双工    | 客户端和服务端可同时读写数据                       |
| 二进制帧支持 | 可传输图片、音频、视频等非文本数据                    |
| 低开销    | 长连接机制避免每次都建立 TCP 连接与重复传输头部           |
| 实时性强   | 无需客户端轮询，消息即时推送                       |
| 可扩展协议  | 支持子协议与数据压缩扩展（如 `permessage-deflate`） |

---

## 🛠️ 服务端如何启用 WSS？

1. 配置 SSL/TLS 证书（如使用 Let's Encrypt）
2. 使用 HTTPS 服务器（如 Nginx、Node.js `https` 模块）
3. 将 WebSocket 服务部署在 TLS 监听端口（通常为 443）
4. 客户端使用 `wss://` 连接即可自动完成握手和加密

> ✅ 建议配合 HTTP/2 或反向代理服务器（如 Nginx）一起使用，提高性能与安全性。

---

## 💡 和 HTTP/2、Socket.IO 有什么区别？

| 协议        | 实现方式             | 是否加密   | 实时性 | 多路复用 | 典型用途     |
| --------- | ---------------- | ------ | --- | ---- | -------- |
| HTTP/1.1  | 请求-响应            | ❌（默认）  | 弱   | ❌    | 网页加载     |
| HTTP/2    | 请求-响应（多路）        | ✅（默认）  | 中等  | ✅    | 网页性能优化   |
| WebSocket | 持久双向连接           | ✅（WSS） | 强   | ❌    | 聊天、协作、推送 |
| Socket.IO | WebSocket + 轮询封装 | ✅（看配置） | 强   | ❌    | 更强兼容性    |

---

## 🎯 面试推荐问法

* WebSocket 如何实现安全通信？
* WSS 和 HTTPS 有什么异同？
* WebSocket 握手流程是怎样的？
* 如何判断 WebSocket 是否安全可靠？

---

## 📚 延伸阅读

* [WebSocket 心跳与断线重连](./websocket-heartbeat-reconnect)
* [TCP 三次握手与四次挥手](./tcp-handshake-termination)
* [从 URL 到页面加载全过程](./url-to-page-loading)

```
