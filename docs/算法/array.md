**41. 缺失的第一个正数**

给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

- 原地置换 缺失的数字肯定在 1 到 n+1 之间，最后判断哪个位置的数字不对，返回该位置的下标+1

```js
var firstMissingPositive = function (nums) {
  const n = nums.length
  for (let i = 0; i < n; i++) {
    while (
      1 <= nums[i] &&
      nums[i] <= n &&
      nums[i] !== nums[nums[i] - 1] &&
      nums[i] !== i + 1
    ) {
      const j = nums[i] - 1
      [nums[i], nums[j]] = [nums[j], nums[i]]
    }
  }

  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1
    }
  }

  return n + 1
}
```

53. 最大子数组和
    给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组是数组中的一个连续部分。

- 动态规划 最大和要么是前一个的最大和加上当前元素，要么从当前元素开始
- 状态转移方程 dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])

```js
var maxSubArray = function (nums) {
  if (nums.length === 0) return 0

  const dp = new Array(nums.length)
  dp[0] = nums[0]
  let maxSum = dp[0]

  for (let i = 1; i < nums.length; i++) {
    // 要么延续前面的子数组，要么从当前元素重新开始
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
    maxSum = Math.max(maxSum, dp[i])
  }

  return maxSum
}
```

- 思考：最大子数组和遍历到当前数字如果 sum 变成负数了，那不管后面的值有多大，起到的都是负面作用，所以直接置 0 然后 sum 再重新开始累加

```js
var maxSubArray = function (nums) {
  let ans = -Infinity,
    sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    ans = Math.max(sum, ans)
    if (sum < 0) sum = 0
  }
  return ans
}
```

238. 除自身以外数组的乘积
     给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。

题目数据 保证 数组 nums 之中任意元素的全部前缀元素和后缀的乘积都在 32 位 整数范围内。

请 不要使用除法，且在 O(n) 时间复杂度内完成此题。

- 思考：
  - 前缀乘积：从左到右遍历数组，计算当前元素左侧所有元素的乘积。
  - 后缀乘积：从右到左遍历数组，计算当前元素右侧所有元素的乘积。
  - 最终结果：将前缀乘积和后缀乘积相乘，得到除当前元素外的乘积。

```js
// 前缀和×后缀和 将nums[i]刨除
var productExceptSelf = function (nums) {
  const preSum = [],
    sufSum = []
  const n = nums.length

  preSum[0] = 1
  for (let i = 1; i < n; i++) preSum[i] = preSum[i - 1] * nums[i - 1]

  sufSum[n - 1] = 1
  for (let i = n - 2; i >= 0; i--) sufSum[i] = sufSum[i + 1] * nums[i + 1]

  const ans = []
  for (let i = 0; i < n; i++) ans[i] = preSum[i] * sufSum[i]

  return ans
}
```

- 优化：思路还是前缀乘积和后缀乘积的乘积 但是只维护一个 ans 数组

利用输出数组存储中间结果：我们可以先用输出数组存储前缀乘积，然后再用变量动态计算后缀乘积并直接与输出数组中的前缀乘积相乘。

分两步计算：

第一步：从左到右计算前缀乘积并存入输出数组

第二步：从右到左计算后缀乘积，同时与输出数组中的前缀乘积相乘

```js
var productExceptSelf = function (nums) {
  const n = nums.length
  const ans = new Array(n)

  ans[0] = 1
  for (let i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1]

  let suffix = 1
  for (let i = n - 1; i >= 0; i--) {
    ans[i] = ans[i] * suffix
    suffix *= nums[i]
  }

  return ans
}
```

56. 合并区间
    以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

- 思考：
  - 先将区间按照起始位置排序
  - 遍历排序后的区间，合并重叠区间
  - 合并规则：如果当前区间的起始位置小于等于上一个区间的结束位置，说明有重叠，更新上一个区间的结束位置为当前区间的结束位置
  - 否则，将当前区间加入结果数组

```js
var merge = function (intervals) {
  intervals.sort((p, q) => p[0] - q[0])

  const ans = []
  for (const p of intervals) {
    const m = ans.length
    if (m && p[0] <= ans[m - 1][1])
      ans[m - 1][1] = Math.max(ans[m - 1][1], p[1])
    else ans.push(p)
  }
  return ans
}
```

- 优化：
  - 可以直接在原数组上操作，不需要额外的数组
  - 可以使用双指针的方法，一个指针遍历排序后的区间，另一个指针指向结果数组的当前位置

```js
var merge = function (intervals) {
  intervals.sort((p, q) => p[0] - q[0])
  let i = 0
  for (const p of intervals) {
    // 情况1：如果是第一个区间(i === 0)，或者当前区间的起始点大于前一个合并区间的结束点(p[0] > intervals[i-1][1])

    // 直接将当前区间加入结果，并递增 i

    // 情况2：当前区间与前一个合并区间有重叠

    // 合并这两个区间，取两个区间结束点的最大值作为新结束点
    if (i === 0 || p[0] > intervals[i - 1][1]) {
      intervals[i++] = p
    } else {
      intervals[i - 1][1] = Math.max(intervals[i - 1][1], p[1])
    }
  }
  return intervals.slice(0, i)
}
```

189. 轮转数组
     给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。

- 最好的思路就是反转三次，1.整体反转 2.前 k 个反转 3.后 n-k 个反转 就能得到轮转后的数组

```js
var rotate = function (nums, k) {
  const n = nums.length
  if (n === 0 || k === 0) return // 避免除零错误（如果数组为空）// 如果 k 是 n 的倍数，无需旋转
  k = k % n
  // 1.整体反转
  reverseArr(nums, 0, n - 1)
  // 2.前k个反转
  reverseArr(nums, 0, k - 1)
  // 3.后n-k个反转
  reverseArr(nums, k, n - 1)
}

function reverseArr(arr, start, end) {
  while (start < end) {
    const temp = arr[start]
    arr[start++] = arr[end]
    arr[end--] = temp
  }
}
```
