136. 只出现一次的数字
给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
- 位运算 异或 相同的两个数会消除
```js
var singleNumber = function (nums) {
    let ans = 0;
    for (const num of nums) {
        ans ^= num;
    }
    return ans;
};
```
169. 多数元素
给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

- Boyer-Moore 算法 原理是投票抵消，比如说一共是ABC三个候选人，A的票数比较多，那A得一票+1，其他两个人得一票的话 就-1，最后A的票数会大于0，说明A是多数元素。
- 遍历数组，用一个变量candidate来记录当前的候选人，用一个变量count来记录当前候选人的票数。
- 遍历数组，遇到当前候选人的票，count+1，否则count-1。
- 当count为0时，说明当前候选人的票被抵消完了，所以需要重新选择候选人。
- 最后剩下的候选人就是多数元素。
```js
var majorityElement = function (nums) {
    let candidate = null;
    let count = 0;
    
    for (const num of nums) {
        if (count === 0) {
            candidate = num;
        }
        count += (num === candidate) ? 1 : -1;
    }

    return candidate;
};
```
75. 颜色分类
给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

必须在不使用库内置的 sort 函数的情况下解决这个问题。
- 三指针法（荷兰国旗算法）
left：指向当前可以放置下一个 0 的位置。

right：指向当前可以放置下一个 2 的位置。

current：当前遍历的指针。

- 初始化：

left = 0，current = 0，right = nums.length - 1。

- 遍历过程：

如果 nums[current] === 0：

交换 nums[current] 和 nums[left]。

left++，current++（因为左边的已经检查过）。

如果 nums[current] === 1：

current++（不需要交换，1 应该在中间）。

如果 nums[current] === 2：

交换 nums[current] 和 nums[right]。

right--（因为交换后的 nums[current] 可能是 0 或 1，需要再次检查，所以不增加 current）。

- 终止条件：current > right。

```js
var sortColors = function (nums) {
    let left = 0, current = 0, right = nums.length - 1;
    while (current <= right) {
        if (nums[current] === 0) {
            [nums[current], nums[left]] = [nums[left], nums[current]];
            left++;
            current++;
        } else if (nums[current] === 1) {
            current++;
        } else if (nums[current] === 2) {
            [nums[current], nums[right]] = [nums[right], nums[current]];
            right--;
        }
    }
};
```
31. 下一个排列
整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。

例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。

例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
给你一个整数数组 nums ，找出 nums 的下一个排列。

必须 原地 修改，只允许使用额外常数空间。
**1. 从后向前查找第一个下降的元素：**

从数组的末尾开始向前遍历，找到第一个满足 nums[i] < nums[i + 1] 的元素 nums[i]。这个位置 i 是需要调整的位置。

如果找不到这样的 i，说明整个数组是降序排列的，已经是最大的排列，直接反转整个数组即可。

**2. 从后向前查找第一个大于 nums[i] 的元素：**

从数组的末尾开始向前遍历，找到第一个满足 nums[j] > nums[i] 的元素 nums[j]。

交换 nums[i] 和 nums[j]。

**3. 反转 i + 1 到末尾的部分：**

交换后，i + 1 到末尾的部分是降序排列的，为了得到最小的下一个排列，需要将这部分反转。
```js
var nextPermutation = function (nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    if (i >= 0) {
        let j = nums.length - 1;
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }

        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
};
```
287. 寻找重复数
给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。

假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。

你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。
- 快慢指针（Floyd 判圈算法）
思路：

将数组视为链表，nums[i] 表示 i 指向 nums[i]。

由于存在重复数字，链表会形成环。

使用快慢指针找到环的入口，即为重复数字。

步骤：

初始化快慢指针 slow = nums[0]，fast = nums[0]。

慢指针每次走一步 slow = nums[slow]，快指针每次走两步 fast = nums[nums[fast]]，直到相遇。

重置慢指针 slow = nums[0]，快慢指针每次走一步，直到再次相遇，相遇点即为重复数字。

```js
var findDuplicate = function (nums) {
    let slow = nums[0], fast = nums[0];
    while (true) {
        slow = nums[slow];
        fast = nums[nums[fast]];
        if (slow === fast) break;
    }
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
};
```
- 二分
数字范围：数字的取值范围是 [1, n]，而不是数组的索引。

统计数量：对于某个中间值 mid，统计数组中小于等于 mid 的数字的个数。

如果没有重复数字，那么数组中小于等于 mid 的数字个数应该正好是 mid 个。

如果有重复数字，那么数组中小于等于 mid 的数字个数可能会多于 mid 个。

```js
var findDuplicate = function (nums) {
    let left = 1;
    let right = nums.length - 1;
    while (left < right) {
        let mid = (left + right) >>> 1;
        let count = 0;
        for (const num of nums) {
            if (num <= mid) count++;
        }
        if (count > mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
};
```