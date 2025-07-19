---
title: 动态给 Vue 的 data 添加新属性时会发生什么？如何解决？
tags: [Vue, 响应式, 数据劫持, Vue2, Vue3]
---
# 动态给 Vue 的 data 添加新属性时会发生什么？如何解决？

---

## 一、问题背景

在开发中，我们经常需要**给 Vue 实例的 `data` 中新增一个属性**，但是：

- 在 Vue 2 中，**直接添加的新属性不会被响应式系统追踪**。
- 在 Vue 3 中，由于使用了 Proxy，对这个问题已有较好解决。

---

## 二、Vue 2 的响应式原理回顾

Vue 2 使用 `Object.defineProperty()` 为 data 中的每个属性添加 getter/setter：

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log(`set ${key}: ${newVal}`);
        val = newVal;
      }
    }
  });
}
```

**问题出现原因：**

* `Object.defineProperty()` 只能在对象**已有的属性上**生效。
* 对象新加的属性不会触发 getter/setter，自然也不会被 Vue 追踪为响应式。

---

## 三、Vue 2 中的解决方案

### ✅ 1. 使用 `Vue.set`（推荐）

```js
this.$set(this.user, 'age', 18);
// 或者
Vue.set(this.user, 'age', 18);
```

**原理：**

* Vue 会内部调用 `defineReactive()` 给新属性添加 getter/setter。
* 并通过 `dep.notify()` 通知视图更新。

```js
Vue.set = function (target, key, val) {
  defineReactive(target, key, val);
  target.__ob__.dep.notify();
};
```

---

### ✅ 2. 使用 `Object.assign` 创建新对象（适合添加多个属性）

```js
this.user = Object.assign({}, this.user, { age: 18, gender: 'female' });
```

---

### ❌ 3. 使用 `$forceUpdate()` 强制刷新（不推荐）

```js
this.$forceUpdate();
```

> 不推荐使用，因为它会跳过响应式系统，无法充分利用 Vue 的性能优化策略。

---

## 四、Vue 3 中的情况

Vue 3 使用了 `Proxy` 对整个对象进行代理，**可以动态追踪新增属性**：

```js
this.user.age = 18; // ✅ 自动变成响应式
```

> ✅ 所以 Vue 3 中，动态添加属性已经不是问题，Vue 会自动追踪并更新视图。

---

## 五、场景建议

| 场景             | 解决方案                           |
| -------------- | ------------------------------ |
| Vue 2 中新增单个属性  | 使用 `Vue.set()` 或 `this.$set()` |
| Vue 2 中新增多个属性  | 使用 `Object.assign()` 创建新对象     |
| Vue 2 中无解的复杂情况 | 退而求其次，使用 `$forceUpdate()`      |
| Vue 3 中        | 直接赋值即可，无需额外处理                  |

---

## 六、总结一句话

> Vue 2 中通过 `Object.defineProperty` 实现响应式，**无法监听对象属性的新增和删除**，可使用 `Vue.set()` 解决；Vue 3 使用 `Proxy`，**可自动追踪所有属性变更**。
