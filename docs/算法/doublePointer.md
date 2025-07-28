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
