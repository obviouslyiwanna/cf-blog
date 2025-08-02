#### 局部最优推全局最优

121. 买卖股票的最佳时机
给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
- 贪心：在遍历数组时，记录、更新当前的最低价格和最大利润
```js
var maxProfit = function (prices) {
    let ans = 0;
    let minPrice = prices[0];
    for (const p of prices) {
        ans = Math.max(ans, p - minPrice);
        minPrice = Math.min(minPrice, p);
    }
    return ans;
};
```
55. 跳跃游戏
给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标，如果可以，返回 true ；否则，返回 false 。

- 可以转换思路，不去想怎么跳跳几步，而是去考虑每次跳完之后，下一步可以覆盖到哪，也就是在下标i的位置上往后跳nums[i]步，如果可以覆盖到末尾的话，说明可以到达
```js
var canJump = function (nums) {
    let cover = 0;
    const n = nums.length;
    if (n === 1) return true;
    for (let i = 0; i <= cover; i++) {
        cover = Math.max(cover, i + nums[i]);
        if (cover >= n - 1) return true;
    }
    return false;
};
```

45. 跳跃游戏 II
给定一个长度为 n 的 0 索引整数数组 nums。初始位置为 nums[0]。

每个元素 nums[i] 表示从索引 i 向后跳转的最大长度。换句话说，如果你在 nums[i] 处，你可以跳转到任意 nums[i + j] 处:

0 <= j <= nums[i] 
i + j < n
返回到达 nums[n - 1] 的最小跳跃次数。生成的测试用例可以到达 nums[n - 1]。

- 更新下一次跳跃范围：nextCover = Math.max(nextCover, i + nums[i])
计算从当前位置i能跳到的最远位置，并更新nextCover

- 到达当前跳跃边界时的处理：

**如果还没到达终点(curCover !== n - 1)，则必须进行一次跳跃**

增加跳跃次数ans++

更新当前跳跃范围为nextCover

如果新范围已经覆盖终点，提前结束循环

```js
var jump = function (nums) {
    let ans = 0;
    const n = nums.length;
    let curCover = 0, nextCover = 0;
    for (let i = 0; i < n; i++) {
        nextCover = Math.max(nextCover, i + nums[i]);
        if (i === curCover) {
            if (curCover !== n - 1) {
                ans++;
                curCover = nextCover;
                if (curCover === n - 1) break; 
            }
            else break;
        }
    }
    return ans;
};
```

763. 划分字母区间
给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 "ababcc" 能够被分为 ["abab", "cc"]，但类似 ["aba", "bcc"] 或 ["ab", "ab", "cc"] 的划分是非法的。

注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。

返回一个表示每个字符串片段的长度的列表。

- 贪心：
记录每个字母的最后出现位置：首先遍历字符串，记录每个字母最后一次出现的位置。

维护当前片段的边界：再次遍历字符串，动态维护当前片段的结束位置。

划分片段：当遍历到当前片段的结束位置时，表示找到了一个符合条件的片段。

```js
var partitionLabels = function(s) {
    const lastOccurrence = {};
    // 记录每个字符最后出现的位置
    for (let i = 0; i < s.length; i++) {
        lastOccurrence[s[i]] = i;
    }
    
    const result = [];
    let start = 0, end = 0;
    // 遍历字符串进行划分
    for (let i = 0; i < s.length; i++) {
        // 更新当前片段的结束位置
        end = Math.max(end, lastOccurrence[s[i]]);
        // 当到达当前片段的结束位置时
        if (i === end) {
            result.push(end - start + 1);
            start = end + 1;
        }
    }
    return result;
};
```
