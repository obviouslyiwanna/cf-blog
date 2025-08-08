560. 和为 K 的子数组
给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

子数组是数组中元素的连续非空序列。
- 暴力枚举

```js
var subarraySum = function (nums, k) {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        let sum = 0;
        for (let j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum === k) count++;
        }
    }
    return count;
};
```
- 前缀和 + 哈希表
前缀和 - 前面的某个前缀和 = 这段区间的和
sum(nums[i..j]) = prefixSum[j+1] - prefixSum[i] = k
所以prefixSum - k存在的话，说明一定有一个区间的和为k 用哈希表来记录出现的次数
```js
var subarraySum = function(nums, k) {
    const map = new Map();
    map.set(0, 1); // 初始化：前缀和为0出现1次
    let prefixSum = 0, count = 0;
    
    for (const num of nums) {
        prefixSum += num;
        // 检查是否存在 prefixSum - k 的前缀和
        if (map.has(prefixSum - k)) {
            count += map.get(prefixSum - k);
        }
        // 更新当前前缀和的出现次数
        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }
    return count;
};
```


523. 连续的子数组和(上一题的扩展 k倍)

给你一个整数数组 nums 和一个整数 k ，如果 nums 有一个 好的子数组 返回 true ，否则返回 false：

一个 好的子数组 是：

长度 至少为 2 ，且
子数组元素总和为 k 的倍数。
注意：

子数组 是数组中 连续 的部分。
如果存在一个整数 n ，令整数 x 符合 x = n * k ，则称 x 是 k 的一个倍数。0 始终 视为 k 的一个倍数。
- 同余定理 如果两个数模k的余数相同，那么这两个数相减一定是k的倍数

```js
var checkSubarraySum = function(nums, k) {
    const map = new Map();
    map.set(0, -1); 
    let prefixSum = 0;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        const mod = k === 0 ? prefixSum : prefixSum % k; // 处理k为0的情况
        
        if (map.has(mod)) {
            if (i - map.get(mod) >= 2) { // 确保子数组长度至少为2
                return true;
            }
        } else {
            map.set(mod, i); // 只记录第一次出现的位置
        }
    }
    
    return false;
};
```
239. 滑动窗口最大值
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回 滑动窗口中的最大值 。

- 单调队列 维护一个单调递减的双端队列，队列中存储的是数组的索引，保证队首始终是当前窗口的最大值。
    遍历数组：

    移除队列中不在当前窗口范围内的索引（从队首）。

    移除队列中所有小于当前元素的索引（从队尾），保持队列单调递减。

    将当前元素索引加入队尾。

    如果窗口形成（i >= k - 1），将队首对应的值加入结果。
```js
var maxSlidingWindow = function(nums, k) {
    const deque = []; // 存储索引
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // 移除不在窗口内的索引（从队首）
        if (deque.length && deque[0] <= i - k) {
            deque.shift();
        }
        
        // 移除队列中所有小于当前元素的索引（从队尾）
        while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        
        deque.push(i); // 当前索引入队
        
        // 当窗口形成时，记录最大值（队首）
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
};
```
76. 最小覆盖子串
给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。
注意：

对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
如果 s 中存在这样的子串，我们保证它是唯一的答案。

- 方法：滑动窗口 + 哈希表
使用滑动窗口技术结合哈希表统计字符频率，动态扩展和收缩窗口以寻找最优解。