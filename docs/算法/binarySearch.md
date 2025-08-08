35. 搜索插入位置
    给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。

- 直接使用二分插入即可

```js
var searchInsert = function (nums, target) {
  const n = nums.length

  let left = 0,
    right = n - 1
  while (left <= right) {
    let mid = (left + right) >>> 1
    if (nums[mid] === target) return mid
    else if (nums[mid] > target) right = mid - 1
    else left = mid + 1
  }

  return left
}
```

74. 搜索二维矩阵
    给你一个满足下述两条属性的 m x n 整数矩阵：

每行中的整数从左到右按非严格递增顺序排列。
每行的第一个整数大于前一行的最后一个整数。
给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。

- 可以对每一行做二分查找，但是我们这道题是总体有序的，就可以将二维的展开成一维的去实现.一维索引 mid 对应的二维坐标是 (mid // n, mid % n)

```js
var searchMatrix = function (matrix, target) {
  const m = matrix.length,
    n = matrix[0].length
  let left = 0,
    right = m * n - 1 // 将二维矩阵视为一维数组

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midVal = matrix[Math.floor(mid / n)][mid % n] // 将一维索引转为二维坐标

    if (target === midVal) return true
    else if (target > midVal) left = mid + 1
    else right = mid - 1
  }
  return false
}
```

34. 在排序数组中查找元素的第一个和最后一个位置
    给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 target，返回 [-1, -1]。

你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

- 总体来说，就是对二分查找进行了两次，一次是查找左边界，一次是查找右边界

```js
var searchRange = function (nums, target) {
  const left = findBound(nums, target, true);
  const right = findBound(nums, target, false);
  return [left, right];
}

function findBound(nums, target, isLeft) {
  let left = 0,
    right = nums.length - 1;
  let bound = -1;

  while (left <= right) {
    const mid = (left + right) >>> 1;
    if (nums[mid] === target) {
      bound = mid; // 记录当前找到的位置
      if (isLeft) {
        right = mid - 1; // 继续向左找更小的左边界
      } else {
        left = mid + 1; // 继续向右找更大的右边界
      }
    } else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return bound;
}
```
4. 寻找两个正序数组的中位数
给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。

算法的时间复杂度应该为 O(log (m+n)) 。
- 通过 二分法递归排除不可能的部分，能够高效地找到两个有序数组的中位数。

- 1. 每次排除 k/2 个元素，确保时间复杂度为 O(log(m + n))。

- 2. 处理奇偶长度，分别计算中位数。

- 3. 边界条件检查，确保代码健壮性。
```js
var findMedianSortedArrays = function (nums1, nums2) {
    const m = nums1.length, n = nums2.length;
    const total = m + n;

    if (total % 2 === 1) {
        return findKth(nums1, nums2, (total >>> 1) + 1);
    } else {
        const left = findKth(nums1, nums2, total / 2);
        const right = findKth(nums1, nums2, total / 2 + 1);
        return (left + right) / 2;
    }
};

function findKth(nums1, nums2, k) {
    const m = nums1.length, n = nums2.length;

    if (m > n) {
        return findKth(nums2, nums1, k);
    }

    // 如果 nums1 为空，直接返回 nums2 的第 k 大的数
    if (m === 0) {
        return nums2[k - 1];
    }

    if (k === 1) {
        return Math.min(nums1[0], nums2[0]);
    }

    // 计算 nums1 和 nums2 的比较位置 各取k/2个数
    const i = Math.min(m, k >>> 1);
    const j = Math.min(n, k >>> 1);

    // 比较 nums1[i - 1] 和 nums2[j - 1]
    if (nums1[i - 1] < nums2[j - 1]) {
        // 排除 nums1 的前 i 个元素
        return findKth(nums1.slice(i), nums2, k - i);
    } else {
        // 排除 nums2 的前 j 个元素
        return findKth(nums1, nums2.slice(j), k - j);
    }
}
```

33. 搜索旋转排序数组
整数数组 nums 按升序排列，数组中的值 互不相同 。

在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。

给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。

你必须设计一个时间复杂度为 O(log n) 的算法解决此问题

- 二分查找的调整：每次取中点 mid 后，先判断哪一半是有序的：

如果 nums[left] <= nums[mid]，说明 左半部分有序。

否则，右半部分有序。

在有序的那一半中，检查 target 是否在该范围内：

如果是，则继续在这一半中搜索。

如果否，则去另一半搜索。

```js
var search = function (nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = (left + right) >>> 1;
        if (nums[mid] === target) return mid;

        if (nums[left] <= nums[mid]) {
            if (target >= nums[left] && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
        }

        else {
            if (target > nums[mid] && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
};
```
153. 寻找旋转排序数组中的最小值
已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]
若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。

给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。

你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。

- 旋转后的数组分为两部分：

左半部分：所有元素 ≥ 第一个元素。

右半部分：所有元素 ≤ 最后一个元素。

**最小值位于右半部分的第一个元素。**

比较 nums[mid] 和 nums[right]：

如果 nums[mid] > nums[right]，说明最小值在 (mid, right] 区间内，因此 left = mid + 1。

否则，最小值在 [left, mid] 区间内，因此 right = mid。

```js
var findMin = function (nums) {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        let mid = (left + right) >>> 1;
        if (nums[mid] > nums[right]) left = mid + 1;
        else right = mid;
    }
    return nums[left];
};
```
