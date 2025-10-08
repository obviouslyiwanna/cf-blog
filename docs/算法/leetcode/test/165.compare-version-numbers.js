/*
 * @lc app=leetcode.cn id=165 lang=javascript
 * @lcpr version=30204
 *
 * [165] 比较版本号
 *
 * https://leetcode.cn/problems/compare-version-numbers/description/
 *
 * algorithms
 * Medium (54.22%)
 * Likes:    457
 * Dislikes: 0
 * Total Accepted:    216.6K
 * Total Submissions: 399.5K
 * Testcase Example:  '"1.2"\n"1.10"'
 *
 * 给你两个 版本号字符串 version1 和 version2 ，请你比较它们。版本号由被点 '.' 分开的修订号组成。修订号的值 是它 转换为整数
 * 并忽略前导零。
 * 
 * 比较版本号时，请按 从左到右的顺序 依次比较它们的修订号。如果其中一个版本字符串的修订号较少，则将缺失的修订号视为 0。
 * 
 * 返回规则如下：
 * 
 * 
 * 如果 version1 < version2 返回 -1，
 * 如果 version1 > version2 返回 1，
 * 除此之外返回 0。
 * 
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：version1 = "1.2", version2 = "1.10"
 * 
 * 输出：-1
 * 
 * 解释：
 * 
 * version1 的第二个修订号为 "2"，version2 的第二个修订号为 "10"：2 < 10，所以 version1 <
 * version2。
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：version1 = "1.01", version2 = "1.001"
 * 
 * 输出：0
 * 
 * 解释：
 * 
 * 忽略前导零，"01" 和 "001" 都代表相同的整数 "1"。
 * 
 * 
 * 示例 3：
 * 
 * 
 * 输入：version1 = "1.0", version2 = "1.0.0.0"
 * 
 * 输出：0
 * 
 * 解释：
 * 
 * version1 有更少的修订号，每个缺失的修订号按 "0" 处理。
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= version1.length, version2.length <= 500
 * version1 和 version2 仅包含数字和 '.'
 * version1 和 version2 都是 有效版本号
 * version1 和 version2 的所有修订号都可以存储在 32 位整数 中
 * 
 * 
 */

import { namespace } from "@generated/site-storage";


// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function (version1, version2) {
    const v1 = version1.split('.').map(num => parseInt(num, 10));
    const v2 = version2.split('.').map(num => parseInt(num, 10));
    const n = Math.max(v1.length, v2.length);

    for (let i = 0; i < n; i++) {
        const n1 = i < v1.length ? v1[i] : 0;
        const n2 = i < v2.length ? v2[i] : 0;
        if (n1 < n2) return -1;
        if (n1 > n2) return 1;
    }
    return 0;
};
// @lc code=end



/*
// @lcpr case=start
// "1.2"\n"1.10"\n
// @lcpr case=end

// @lcpr case=start
// "1.01"\n"1.001"\n
// @lcpr case=end

// @lcpr case=start
// "1.0"\n"1.0.0.0"\n
// @lcpr case=end

 */

