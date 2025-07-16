---
title: WebSocket 的心跳与重连机制详解
tags: [WebSocket, 前端面试, 实时通信, 网络协议]
---

## 🧠 前言

WebSocket 是一种在单个 TCP 连接上实现**全双工通信**的协议。相比传统的轮询方式，它能显著降低延迟、减少带宽消耗，适用于需要实时通信的场景，如在线聊天室、实时监控、协同编辑等。

但在实际应用中，由于网络波动、断线、浏览器休眠等原因，WebSocket 连接可能中断。因此，**心跳机制**和**断线重连机制**成为稳定 WebSocket 通信的重要保障。

---

## 🌐 一、WebSocket 基本特性回顾

- ✅ **协议层次**：基于 TCP，支持长连接、全双工通信
- ✅ **通信方式**：支持文本帧和二进制帧
- ✅ **握手机制**：使用 HTTP 完成一次握手，升级协议至 `ws://` 或 `wss://`
- ✅ **节省资源**：避免频繁创建连接，降低带宽压力

---

## ❤️ 二、心跳机制

> WebSocket 协议本身不自带心跳机制，需**应用层实现**。

### 🔧 为什么需要心跳？

- 长时间无数据交互，某些中间设备（如代理、网关）可能关闭连接
- 网络异常无法感知，需要主动探测连接状态
- 客户端或服务端需要判断是否断线以触发重连

---

### 📋 心跳原理

#### ✅ 客户端心跳：
1. 客户端**定时发送 ping 消息**（如 `ping` 字符串）
2. 服务器接收到后立即**回传 pong 消息**
3. 若超时未收到响应，则认为连接中断，触发重连

#### ✅ 服务端心跳：
1. 服务端**定时向客户端发送心跳包**
2. 客户端回传响应消息（如 `pong`）
3. 若无响应，服务器可主动关闭连接

---

### ⏱️ 心跳示例代码（客户端）

```ts
let socket = new WebSocket("ws://your-server");

let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

function startHeartbeat() {
  heartbeatInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping" }));
    }
  }, 30000); // 每 30 秒发送一次
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "pong") {
    console.log("收到服务器 pong 响应");
  }
};

socket.onopen = () => {
  console.log("WebSocket 连接成功");
  startHeartbeat();
};

socket.onclose = () => {
  console.log("WebSocket 连接关闭，准备重连...");
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  reconnect();
};
```

---

## 🔄 三、重连机制

> WebSocket 原生**不支持自动重连**，需要手动实现。

### 💡 重连实现关键点：

#### 1. **监听关闭事件**

```ts
socket.onclose = () => {
  console.log("连接断开，准备重连");
  reconnect();
};
```

#### 2. **重连策略设计**

| 策略       | 说明                           |
| -------- | ---------------------------- |
| 固定间隔重连   | 每次断线后固定等待 3\~5 秒再尝试重连        |
| 指数退避重连   | 重连间隔呈指数增长，如 1s、2s、4s、8s      |
| 最大重连次数限制 | 防止死循环重连，可设置最多重连 5 次          |
| 网络状态判断   | 利用 `navigator.onLine` 判断是否离线 |

#### ✅ 示例代码（重连逻辑）

```ts
let retryCount = 0;
const MAX_RETRY = 5;

function reconnect() {
  if (retryCount >= MAX_RETRY) {
    console.warn("重连失败，已达到最大尝试次数");
    return;
  }

  setTimeout(() => {
    retryCount++;
    console.log(`正在进行第 ${retryCount} 次重连...`);
    socket = new WebSocket("ws://your-server");
    // 重新绑定事件
    socket.onopen = () => {
      console.log("重连成功");
      retryCount = 0;
      startHeartbeat();
    };
    socket.onclose = reconnect;
  }, 1000 * Math.pow(2, retryCount)); // 指数退避
}
```

---

## 📌 四、小结

| 功能    | 是否内置于协议 | 是否需要自己实现  |
| ----- | ------- | --------- |
| 心跳检测  | ❌ 否     | ✅ 是       |
| 自动重连  | ❌ 否     | ✅ 是       |
| 数据压缩  | ✅ 支持    | ⛔ 不推荐手动压缩 |
| 二进制传输 | ✅ 支持    | -         |

---

## 🎯 面试推荐问法

* WebSocket 与 HTTP 的区别？
* WebSocket 如何实现断线重连与保活？
* WebSocket 如何节省带宽、提升性能？
* 如何实现前端与后端的心跳逻辑协同？

---

## 📚 延伸阅读

* [TCP 三次握手与四次挥手](./tcp-handshake-termination)
* [HTTP/2 与 WebSocket 区别](./http2-vs-websocket)
* [从 URL 到页面加载全过程](./url-to-page-loading)

```
