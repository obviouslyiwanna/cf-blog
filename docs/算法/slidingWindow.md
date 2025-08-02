**连续的区间或子序列**

3. 无重复字符的最长子串
   给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。
- 用一个哈希表来存当前窗口的字符，如果有重复的，那就将向右移动，直到去除重复元素，并且将右边的元素加入哈希表。也就是右边扩展，左边的元素需要缩小窗口，直到没有重复的元素。

```js
var lengthOfLongestSubstring = function (s) {
    let map = new Map();
    let max = 0;
    let left = 0;
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (map.has(char) && map.get(char) >= left) left = map.get(char) + 1;
        map.set(char, right);
        max = Math.max(max, right - left + 1);
    }
    return max;
}
```
438. 找到字符串中所有字母异位词
给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

- 滑动窗口：动态维护一个长度等于 p.length 的窗口。

- 哈希表统计：用 pMap 和 sMap 分别统计 p 和当前窗口的字符频率。

- 窗口调整：

右移 right 扩展窗口。

当窗口过大时，右移 left 收缩窗口。

频率比较：当窗口大小合适时，检查 sMap 是否和 pMap 匹配。
```js
var findAnagrams = function(s, p) {
    const pLen = p.length;
    const sLen = s.length;
    if (sLen < pLen) return [];

    const pMap = new Map();
    const sMap = new Map();
    const result = [];

    // 统计 p 的字符频率
    for (const char of p) {
        pMap.set(char, (pMap.get(char) || 0) + 1);
    }

    // 滑动窗口
    let left = 0;
    for (let right = 0; right < sLen; right++) {
        const char = s[right];
        sMap.set(char, (sMap.get(char) || 0) + 1);

        // 窗口大小超过 pLen，左边界右移
        if (right - left + 1 > pLen) {
            const leftChar = s[left];
            sMap.set(leftChar, sMap.get(leftChar) - 1);
            if (sMap.get(leftChar) === 0) sMap.delete(leftChar);
            left++;
        }

        // 窗口大小等于 pLen 时比较
        if (right - left + 1 === pLen && mapsEqual(pMap, sMap)) {
            result.push(left);
        }
    }

    return result;
};

function mapsEqual(map1, map2) {
    if (map1.size !== map2.size) return false;
    for (const [key, val] of map1) {
        if (map2.get(key) !== val) return false;
    }
    return true;
}
```

