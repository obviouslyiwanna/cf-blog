---
title: Vue 错误处理机制
tags: [Vue, 错误处理]
---


## 一、常见错误类型与对应处理策略

| 错误类型            | 示例                          | 推荐处理方式                             |
| --------------- | --------------------------- | ---------------------------------- |
| 后端接口错误          | 接口返回 500、404、超时、响应异常等       | Axios interceptor + 错误码统一管理        |
| JavaScript 运行错误 | 某变量未定义、null 调用属性、JSON 解析失败等 | `try...catch` + 全局 `errorHandler`  |
| Vue 组件错误        | 子组件渲染时抛错、生命周期异常             | `errorCaptured` + 全局 error handler |
| 异步逻辑错误          | `await` 等待失败、网络中断等          | `try...catch` + promise `.catch()` |
| 样式渲染错误          | 由于 class 绑定失败、资源丢失导致的界面错乱   | Fallback UI、骨架屏等                   |
| 地图或图表插件错误       | Mapbox、ECharts 渲染时报错        | 插件自身的错误监听机制 + fallback             |

---

## 二、后端接口错误处理（Axios 拦截器）

你提到使用 axios 的 response 拦截器是正确的，推荐实现方式如下：

```ts
import axios from 'axios';
import { ElMessage } from 'element-plus';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 0) {
      ElMessage.error(res.message || '请求错误');
      return Promise.reject(new Error(res.message));
    }
    return res.data; // 直接返回核心数据
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || '网络异常，请稍后重试');
    return Promise.reject(error);
  }
);
```

> 补充建议：统一管理错误码，可通过 `code => message` 映射表让后端错误更具语义化。

---

## 三、逻辑错误处理（try-catch）

尤其是在处理 `async/await` 时，推荐使用 try-catch 块捕获异常：

```ts
async function fetchData() {
  try {
    const res = await service.get('/api/data');
    // do something
  } catch (error) {
    console.error('fetchData error:', error);
    ElMessage.error('数据获取失败');
  }
}
```

---

## 四、Vue 组件内部错误处理

Vue 2.5+ 支持组件级错误捕获：

### 1. `errorCaptured` 生命周期钩子（子组件错误）

```ts
export default {
  errorCaptured(err, vm, info) {
    console.error('组件错误:', err, info);
    // 可上报错误、提示用户等
    return false; // 如果返回 true，错误不会继续往上传递
  }
}
```

### 2. 全局错误处理器（Vue.config.errorHandler）

```ts
app.config.errorHandler = (err, vm, info) => {
  console.error('全局 Vue 错误:', err, info);
  ElMessage.error('系统出错，请稍后再试');
};
```

> **Vue3 中需通过 `app.config.errorHandler` 设置**

---

## 五、页面级降级处理（错误边界组件）

自定义一个“错误边界”组件，在组件树中包裹关键内容，一旦出现错误展示 fallback UI：

```vue
<template>
  <div v-if="hasError">
    <p>加载失败，请稍后再试。</p>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
const hasError = ref(false);

onErrorCaptured((err, instance, info) => {
  console.error('边界错误:', err, info);
  hasError.value = true;
  return false;
});
</script>
```

---

## 六、其他补充机制

* ✅ 控制台警告抑制（开发时清爽调试）：

  ```ts
  app.config.warnHandler = (msg, vm, trace) => {
    // console.warn(msg)
  };
  ```
* ✅ 错误上报（前端监控系统）：
  推荐接入 Sentry、Fundebug、阿里云前端监控服务。

---

## 七、总结流程图

```text
接口错误
  ↳ Axios 拦截器
  ↳ 统一异常提示 / 自动跳转登录 / Token 失效处理

运行时错误
  ↳ try-catch 包裹核心逻辑
  ↳ async 错误统一处理

组件错误
  ↳ errorCaptured 捕获子组件异常
  ↳ app.config.errorHandler 兜底全局错误

展示降级
  ↳ 自定义错误边界组件
  ↳ fallback UI