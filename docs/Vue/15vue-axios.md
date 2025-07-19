---
title: Vue 项目中 axios 的封装及原理
tags: [Vue, Axios, HTTP封装, 拦截器, 异常处理]
---

# 🌐 为什么要封装 Axios？

在 Vue 项目中直接使用 axios 虽然简单，但对于**大型项目**或**团队开发**而言，存在以下问题：

- 请求配置分散，难以维护
- 重复代码多，冗余
- 响应数据结构不统一，后续处理麻烦
- 错误处理重复
- 缺乏统一的拦截机制（如 token、loading）

---

# 🧱 封装的核心内容

## 1️⃣ 创建 axios 实例

通过 `axios.create()` 创建具有统一配置的实例：

```ts
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})
```

## 2️⃣ 请求拦截器：统一处理 token、loading

```ts
instance.interceptors.request.use(
  config => {
    // token 注入
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 可添加 loading 开启逻辑
    return config
  },
  error => Promise.reject(error)
)
```

## 3️⃣ 响应拦截器：统一处理响应、错误、重定向等

```ts
instance.interceptors.response.use(
  response => {
    const { code, data, message } = response.data
    if (code === 200) {
      return data
    } else {
      ElMessage.error(message || '接口异常')
      return Promise.reject(new Error(message))
    }
  },
  error => {
    const status = error.response?.status
    if (status === 401) {
      // 未授权，跳转登录
      window.location.href = '/login'
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)
```

## 4️⃣ 封装常用方法

```ts
export const get = <T = any>(url: string, params?: any): Promise<T> =>
  instance.get(url, { params })

export const post = <T = any>(url: string, data?: any): Promise<T> =>
  instance.post(url, data)
```

---

# 📦 支持的高级功能

* ✅ 设置统一的 baseURL 和 timeout
* ✅ 添加请求头（Authorization、Content-Type）
* ✅ 配置请求重试（可选）
* ✅ 支持取消请求（CancelToken）
* ✅ 自动转换 JSON 数据
* ✅ 防御 XSRF 攻击（通过 xsrfCookieName、xsrfHeaderName）

---

# 💡 axios 核心原理简述

1. **axios.create**：创建实例，保存默认配置
2. **配置合并**：用户配置与默认配置合并
3. **拦截器机制**：通过内部 handlers 数组管理请求/响应拦截器（链式调用）
4. **适配器**：根据平台选择 XMLHttpRequest 或 Node.js 的 http 模块
5. **返回 Promise**：响应后返回 Promise 对象（支持 then/catch）

---

# 🧪 axios 源码流程小结

```text
axios() => dispatchRequest(config)
        => mergeConfig => transformRequest
        => request adapter (XHR/HTTP)
        => transformResponse => Promise resolve/reject
```

---

# ⚠️ 状态码处理建议

```ts
const errorMap = {
  400: '请求错误',
  401: '未授权',
  403: '拒绝访问',
  404: '资源不存在',
  500: '服务器错误'
}

const handleError = status => {
  ElMessage.error(errorMap[status] || '未知错误')
}
```

---

# 📌 常见使用场景

| 场景         | 处理                                        |
| ---------- | ----------------------------------------- |
| token 注入   | 请求拦截器                                     |
| 权限异常跳转登录   | 响应拦截器                                     |
| 表单数据提交     | 使用 `qs.stringify()`                       |
| 文件上传       | 设置 `Content-Type` 为 `multipart/form-data` |
| 全局 loading | 拦截器中注入/销毁 loading 实例                      |
| 多环境支持      | 使用环境变量控制 baseURL                          |

---

# ✅ 最终导出结构示例

```ts
// api/request.ts
import axios from 'axios'
const instance = axios.create(/* ...配置 */)

instance.interceptors.request.use(/* ... */)
instance.interceptors.response.use(/* ... */)

export default instance
```

```ts
// api/index.ts
import request from './request'

export const fetchUser = () => request.get('/user/info')
```

---

# 🧠 总结一句话

> axios 封装的本质是将**请求逻辑结构化、统一化、标准化**，提高代码可维护性、可扩展性和容错性。
