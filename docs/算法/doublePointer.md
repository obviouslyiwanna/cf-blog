283. 移动零
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

请注意 ，必须在不复制数组的情况下原地对数组进行操作。
- 思路：使用双指针，一个指针指向当前遍历的位置，一个指针指向非零元素应该存放的位置。最后剩下的那些用0进行填充
```js
var moveZeroes = function (nums) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    nums.fill(0, slow);
}
```
11. 盛最多水的容器
给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

说明：你不能倾斜容器。
![alt text](image-2.png)
- 思路：去找左边最大高度和右边最大高度，然后取两者的较小值，乘以宽度，就是当前的面积。
- 然后取所有面积的较大值，就是最终的结果。
```js
var maxArea = function (height) {
    let ans = 0, left = 0, right = height.length - 1;
    while (left < right) {
        let area = (right - left) * Math.min(height[left], height[right]);
        ans = Math.max(area, ans);
        if (height[left] > height[right]) right--;
        else left++;
    }
    return ans;
};
```
15. 三数之和
给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。 去重的话就是分别对i,left,right及其临近的元素进行去重。
- 思路：先对数组进行**排序**，然后使用双指针，一个指针指向当前遍历的位置，一个指针指向左边的位置，一个指针指向右边的位置。
- 然后根据当前的和，判断是否等于0，如果等于0，那么就将当前的三元组加入到结果数组中。
- 如果当前的和小于0，那么就将左指针向右移动一位。
- 如果当前的和大于0，那么就将右指针向左移动一位。
- 最后返回结果数组。

```js
var threeSum = function (nums) {
    let res = [];
    const n = nums.length;
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < n; i++) {
        if (nums[0] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1, right = n - 1;
        while (left < right) {
            let sum = nums[i] + nums[left] + nums[right];
            if (sum > 0) right--;
            else if (sum < 0) left++;
            else {
                res.push([nums[i], nums[left], nums[right]]);
                while (right > left && nums[right] === nums[right - 1]) right--;
                while (right > left && nums[left] === nums[left + 1]) left++;
                left++;
                right--;
            }
        }
    }

    return res;
};
```
**42. 接雨水**
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
![alt text](image-3.png)
- 前缀和后缀
- 维护一个前缀最大值和后缀最大值
- 取前缀最大值和后缀最大值的较小值，减去当前的高度，就是当前的接雨水量
```js
var trap = function(height) {
    const n = height.length;
    const preMax = Array(n); 
    preMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        preMax[i] = Math.max(preMax[i - 1], height[i]);
    }

    const sufMax = Array(n); 
    sufMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        sufMax[i] = Math.max(sufMax[i + 1], height[i]);
    }

    let ans = 0;
    for (let i = 0; i < n; i++) {
        ans += Math.min(preMax[i], sufMax[i]) - height[i]; 
    }
    return ans;
};
```
- 单调栈解法
```js
var trap = function (height) {
    let stack = [];
    let ans = 0;
    const n = height.length;
    stack.push(0);

    for (let i = 1; i < n; i++) {
        while (stack.length && height[i] > height[stack[stack.length - 1]]) {
            const mid = stack.pop();
            if (!stack.length) break;
            const left = stack[stack.length - 1];
            const right = i;

            const curHeight = Math.min(height[left], height[right]) - height[mid];
            const curWidth = right - left - 1;
            ans += curHeight * curWidth;
        }
        stack.push(i);
    }
    return ans;
};
```

