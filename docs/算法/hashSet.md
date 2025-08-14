1. 两数之和
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。
- 用哈希表存储每个值和其下标，遍历数组时，检查哈希表中是否存在当前值的补数（目标值减去当前值）。
- 如果存在，说明找到了两个数，返回它们的下标。
- 如果不存在，将当前值和下标存入哈希表。
```js
var twoSum = function (nums, target) {
    const map = new Map();
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        const x = nums[i];
        if (map.has(target - x)) return [map.get(target - x), i];
        map.set(x, i);
    }
};
```
49. 字母异位词分组
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。字母异位词是指字母相同但排列顺序不同的单词，比如 "eat"、"tea"、"ate" 属于同一组异位词。

- 去设置一个key是排序后的，遍历过程中，如果是一致的那就加入当前这个key分组的[]中。
```js
var groupAnagrams = function (strs) {
    const map = new Map();
    for (const s of strs) {
        let sorted = s.split('').sort().join('');
        if (!map.has(sorted)) {
            map.set(sorted, []);
        }
        map.get(sorted).push(s);
    }
    return [...map.values()];
};
```
- 去计算每个s里面的26个字母的数量，然后将这个数量作为key，将s加入到当前key分组的[]中。
```js
var groupAnagrams = function (strs) {
    const map = new Map();
    for (const s of strs) {
        const count = new Array(26).fill(0);
        for (const c of s) {
            count[c.charCodeAt() - 97]++;
        }
        const key = count.join('#');
        if (!map[key]) {
            map[key] = [];
        }
        map[key].push(s);
    }
    return Object.values(map);
};
```

128. 最长连续序列
给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

- 用哈希表存储每个值和其下标，遍历数组时，检查哈希表中是否存在当前值的后面的值，连续序列的两端下标之差就是长度，再与当前的ans比大小。
if (set.has(x - 1)) continue; 的作用是 确保只从连续序列的起点开始计算，避免重复计算。
```js
var longestConsecutive = function(nums) {
    const set = new Set(nums);
    let maxLen = 0;
    for (const num of set) {
        if (set.has(num - 1)) continue; // 确保是序列起点
        let currentNum = num;
        let currentLen = 1;
        while (set.has(currentNum + 1)) {
            currentNum++;
            currentLen++;
        }
        maxLen = Math.max(maxLen, currentLen);
    }
    return maxLen;
};
```
