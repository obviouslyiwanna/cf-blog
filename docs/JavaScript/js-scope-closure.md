---
title: JavaScript 中的作用域与闭包
tags: [JavaScript, 闭包, 作用域]
---

## 📌 一、作用域 Scope 是什么？

作用域是指**变量的可访问范围**。

JavaScript 有以下几种作用域：

- **全局作用域（Global）**
- **函数作用域（Function）**
- **块级作用域（Block）**（ES6 引入的 let / const）

作用域链是变量查找的过程：**从当前作用域向外一层一层查找，直到全局作用域**。

---

## 🧠 二、闭包 Closure 是什么？

闭包 = **函数 + 其词法作用域**

> **闭包的本质：函数“记住”了它被创建时的作用域，即使函数在当前作用域外执行，也能访问原作用域中的变量。**

典型场景：

```js
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```
## 💡 三、面试真题：输出什么？为什么？
题目一：
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

✅ 答案：
3
3
3
🔍 解析：
var 没有块级作用域，i 是共享的一个变量。

所有回调函数在主线程执行完后执行，此时 i = 3，所以打印了三次 3。

🧪 题目二（闭包生成私有变量）：
```js
function makeCounter() {
  let count = 0;
  return function () {
    return ++count;
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1()); // ?
console.log(counter1()); // ?
console.log(counter2()); // ?

```
✅ 答案：
1
2
1

🔍 解析：
每次调用 makeCounter() 会返回一个新的闭包实例。

它们各自拥有独立的 count 变量。

## 🚫 四、常见误区
| 误区             | 正解                           |
| -------------- | ---------------------------- |
| 闭包 = 任意嵌套函数    | ❌ 不准确，只有**访问外部变量**的内部函数才构成闭包 |
| 闭包会自动导致内存泄漏    | ❌ 不是自动，内存泄漏只会发生在不释放引用的前提下    |
| 使用 `var` 不会有问题 | ❌ 它没有块作用域，会导致循环体中闭包访问的是同一个变量 |


## ✍️ 五、手写经典闭包题
封装一个具有私有变量的模块：
```js
function createUser() {
  let name = 'Kaykay';
  return {
    getName() {
      return name;
    },
    setName(newName) {
      name = newName;
    },
  };
}

const user = createUser();
console.log(user.getName()); // Kaykay
user.setName('AI');
console.log(user.getName()); // AI
```
## 🧱 六、面试中如何讲闭包（建议表达）
“闭包是函数与其词法作用域的组合”

“常用于数据缓存、私有变量封装、异步循环变量捕获”

“合理使用闭包可以增强模块化；但注意闭包生命周期，避免内存泄漏”

## 📚 七、延伸阅读
《你不知道的JavaScript（上卷）》第 1、2 章

MDN：闭包

LeetCode 题：JS 闭包实现缓存函数、模拟 once、debounce 等

🧭 下一篇建议阅读：this 指向与绑定规则（js-this-binding.md）