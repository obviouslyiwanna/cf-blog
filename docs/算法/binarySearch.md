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
  const left = findBound(nums, target, true)
  const right = findBound(nums, target, false)
  return [left, right]
}

function findBound(nums, target, isLeft) {
  let left = 0,
    right = nums.length - 1
  let bound = -1

  while (left <= right) {
    const mid = (left + right) >>> 1
    if (nums[mid] === target) {
      bound = mid // 记录当前找到的位置
      if (isLeft) {
        right = mid - 1 // 继续向左找更小的左边界
      } else {
        left = mid + 1 // 继续向右找更大的右边界
      }
    } else if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return bound
}
```
