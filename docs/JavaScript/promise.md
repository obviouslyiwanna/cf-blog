```js
/**
 1、传入了一个函数，resolve，reject
 2、三种状态：等待中 pending，成功状态fulfilled，失败的状态rejected
 3、resolve (pending--> fulfilled), reject( pending -> rejected)
 4、状态一旦改变，就冻结了。
 5、then方法接收两个涵数(successCb，failcb），而且能拿到成功的值，和失败的原因
**/
function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    x.then(
      value => {
        resolve(value)
      },
      reason => {
        reject(reason)
      }
    )
  } else {
    resolve(x)
  }
}

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.successCb = []
    this.failCb = []

    this.resolve = value => {
      if (this.state !== PENDING) return
      this.state = FULFILLED
      this.value = value
      while (this.successCb.length) {
        this.successCb.shift()(this.value)
      }
    }

    this.reject = reason => {
      if (this.state !== PENDING) return
      this.state = REJECTED
      this.reason = reason
      while (this.failCb.length) {
        this.failCb.shift()(this.reason)
      }
    }

    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  then = (successCb, failCb) => {
    successCb = successCb ? successCb : value => value
    failCb = failCb
      ? failCb
      : reason => {
          throw reason
        }
    return new MyPromise((resolve, reject) => {
      if (this.state === FULFILLED) {
        try {
          let x = successCb(this.value)
          resolvePromise(x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      } else if (this.state === REJECTED) {
        try {
          let x = failCb(this.reason)
          resolvePromise(x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      } else {
        // 一般遇到异步的时候，会走到else，也就是当前的状态是pending的时候，会把successCb和failCb存起来
        successCb &&
          this.successCb.push(() => {
            try {
              let x = successCb(this.value)
              resolvePromise(x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        failCb &&
          this.failCb.push(() => {
            try {
              let x = failCb(this.reason)
              resolvePromise(x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
      }
    })
  }
  static all(array) {
    let res = []
    let flag = 0
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        if (element instanceof MyPromise) {
          element.then(
            value => {
              flag++
              res[i] = value
              if (flag === array.length) {
                resolve(res)
              }
            },
            reason => {
              reject(reason)
            }
          )
        } else {
          flag++
          res[i] = element
          if (flag === array.length) {
            resolve(res)
          }
        }
      }
    })
  }
  catch(cb) {
    return this.then(undefined, reason => cb(reason))
  }
}
```
```js
const PENDING='pending'
const FULFILLED='fulfilled'
const REJECTED='rejected'

function reslovePromise(promise2,x,resolve,reject){
  if(promise2====x){
    return reject(new TypeError('chaining cycle detected for promise'));
  }

  if(x&&(typeof x==='object'||typeof x==='function')){
    let called=false;
    try{
      let then=x.then;
      if(typeof then ==='function'){
        then.call(
          x,
          y=>{
            if(called) return;
            called=true;
            resolvePromise(promise2,y,resolve,reject);
          },
          r=>{
            if(called) return;
            called=true;
            reject(r);
          }
        )else{
          resolve(x);
        }
      }catch(err){
        if
      }
    }
  }
}
```