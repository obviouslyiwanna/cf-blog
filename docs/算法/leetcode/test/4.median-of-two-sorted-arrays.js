/*
 * @lc app=leetcode.cn id=4 lang=javascript
 * @lcpr version=30204
 *
 * [4] 寻找两个正序数组的中位数
 *
 * https://leetcode.cn/problems/median-of-two-sorted-arrays/description/
 *
 * algorithms
 * Hard (43.88%)
 * Likes:    7696
 * Dislikes: 0
 * Total Accepted:    1.4M
 * Total Submissions: 3.1M
 * Testcase Example:  '[1,3]\n[2]'
 *
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
 * 
 * 算法的时间复杂度应该为 O(log (m+n)) 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 输入：nums1 = [1,3], nums2 = [2]
 * 输出：2.00000
 * 解释：合并数组 = [1,2,3] ，中位数 2
 * 
 * 
 * 示例 2：
 * 
 * 输入：nums1 = [1,2], nums2 = [3,4]
 * 输出：2.50000
 * 解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
 * 
 * 
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * nums1.length == m
 * nums2.length == n
 * 0 <= m <= 1000
 * 0 <= n <= 1000
 * 1 <= m + n <= 2000
 * -10^6 <= nums1[i], nums2[i] <= 10^6
 * 
 * 
 */


// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    const m = nums1.length, n = nums2.length;
    const total = m + n;
    if (total % 2 === 1) {
        return findKth(nums1, nums2, (total >>> 1) + 1);
    } else {
        const left = findKth(nums1, nums2, total >>> 1);
        const right = findKth(nums1, nums2, (total >>> 1) + 1);
        return (left + right) / 2;
    }
};

function findKth(nums1, nums2, k) {
    const m = nums1.length, n = nums2.length;
    if (m > n) return findKth(nums2, nums1, k);

    if (m === 0) return nums2[k - 1];
    if (k === 1) return Math.min(nums1[0], nums2[0]);

    const i = Math.min(m, k >>> 1);
    const j = Math.min(n, k >>> 1);
    if (nums1[i - 1] < nums2[j - 1]) {
        return findKth(nums1.slice(i), nums2, k - i);
    } else {
        return findKth(nums1, nums2.slice(j), k - j);
    }
}
// @lc code=end



/*
// @lcpr case=start
// [1,3]\n[2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n[3,4]\n
// @lcpr case=end

 */

