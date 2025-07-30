**41. 缺失的第一个正数**  

给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

- 原地置换 缺失的数字肯定在1到n+1之间，最后判断哪个位置的数字不对，返回该位置的下标+1
```js
var firstMissingPositive = function (nums) {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        while (1 <= nums[i] && nums[i] <= n && nums[i] !== nums[nums[i] - 1] && nums[i] !== i + 1) {
            const j = nums[i] - 1;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }

    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }

    return n + 1;
};
```
