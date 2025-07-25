---
title: TCP 为什么需要三次握手与四次挥手？
tags: [TCP, 网络协议]
---

## 📌 一、前言

TCP 是一种**面向连接的、可靠的传输协议**。在建立连接前和断开连接时，分别需要经历“三次握手（3-way handshake）”和“四次挥手（4-way termination）”的过程。这两个过程看似“啰嗦”，但其实是为了确保**连接可靠建立**与**数据完整释放**。

---

## 🤝 二、为什么需要“三次握手”？

### ✅ 三次握手的目的：
1. **确认客户端发送能力**
2. **确认服务端接收能力**
3. **确认服务端发送能力，客户端接收能力**

---

### 📋 三次握手流程详解：

```text
客户端        → SYN = 1, seq = x       → 服务端
客户端 ← SYN = 1, ACK = 1, seq = y, ack = x+1 ← 服务端
客户端        → ACK = 1, ack = y+1    → 服务端
```

* 第一次：客户端发送 SYN，表示“我要建立连接”，并发送初始序号 `seq = x`
* 第二次：服务端回应 SYN + ACK，表示“收到你的请求，也允许连接”，同时发送初始序号 `seq = y`，并 `ack = x+1`
* 第三次：客户端回应 ACK，表示“我知道你收到了我的请求”，`ack = y+1`，连接正式建立

---

### ❓为什么不是两次就够？

假设只进行两次握手：

* 若客户端发送的第一个 SYN 包因网络延迟被滞留，后来又被服务端误认为是**新的连接请求**，就可能导致服务端错误地建立了一个连接（**“旧连接复活”问题**）。
* 第三次握手可以让客户端**确认服务端状态正常且不是因旧包建立连接**，避免建立错误连接。

---

## 👋 三、为什么需要“四次挥手”？

### ✅ 四次挥手的目的：

1. 双方**都能完全地关闭发送和接收通道**
2. 保证最后的数据传输不会丢失

---

### 📋 四次挥手流程详解：

```text
客户端        → FIN = 1, seq = u        → 服务端
客户端 ← ACK = 1, ack = u+1           ← 服务端
客户端 ← FIN = 1, seq = v             ← 服务端
客户端        → ACK = 1, ack = v+1     → 服务端
```

* 第一次：客户端发送 `FIN`，请求关闭连接（我不再发送数据了，但我还能接收）
* 第二次：服务端回应 `ACK`，确认客户端的关闭请求
* 第三次：服务端准备完数据后，发送 `FIN`，通知客户端它也不再发送数据了
* 第四次：客户端发送 `ACK`，确认收到服务端的关闭请求，连接完全断开

---

### ❓为什么不是三次就能关闭？

因为 TCP 是**全双工通信**，数据传输是**双向的**：

* 客户端关闭发送后，服务端还可能有数据没发完，**不能立即关闭连接**
* 所以需要让两边都**分别关闭自己的发送方向**
* 每个方向都要“FIN + ACK”配对，**两个方向就是两对，共四次**

---

## ⏳ 四、TIME\_WAIT 状态

* 客户端发送最后一个 `ACK` 后进入 `TIME_WAIT` 状态（等待 2 倍最大报文生存时间）
* 防止最后一个 ACK 丢失时，服务端重发 FIN，客户端还能再次发送 ACK
* 避免后续连接受到之前延迟报文的干扰

---

## 🎯 总结口诀

> 三次握手：防“假连接”，确认双向可达  

> 四次挥手：彻底关闭连接，避免数据丢失  

> TIME\_WAIT：再等等，别让旧连接影响新会话

