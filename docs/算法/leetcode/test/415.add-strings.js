/*
 * @lc app=leetcode.cn id=415 lang=javascript
 * @lcpr version=30204
 *
 * [415] 字符串相加
 *
 * https://leetcode.cn/problems/add-strings/description/
 *
 * algorithms
 * Easy (54.94%)
 * Likes:    888
 * Dislikes: 0
 * Total Accepted:    388.4K
 * Total Submissions: 706.8K
 * Testcase Example:  '"11"\n"123"'
 *
 * 给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和并同样以字符串形式返回。
 * 
 * 你不能使用任何內建的用于处理大整数的库（比如 BigInteger）， 也不能直接将输入的字符串转换为整数形式。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 输入：num1 = "11", num2 = "123"
 * 输出："134"
 * 
 * 
 * 示例 2：
 * 
 * 输入：num1 = "456", num2 = "77"
 * 输出："533"
 * 
 * 
 * 示例 3：
 * 
 * 输入：num1 = "0", num2 = "0"
 * 输出："0"
 * 
 * 
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= num1.length, num2.length <= 10^4
 * num1 和num2 都只包含数字 0-9
 * num1 和num2 都不包含任何前导零
 * 
 * 
 */

import { namespace } from "@generated/site-storage";


// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
    let res = '';
    let n = num1.length - 1, m = num2.length - 1;
    let carry = 0;
    while (n >= 0 || m >= 0) {
        let x = n >= 0 ? num1[n] - '0' : 0;
        let y = m >= 0 ? num2[m] - '0' : 0;
        let sum = x + y + carry;
        res += (sum % 10);
        carry = Math.floor(sum / 10);
        n--;
        m--;
    }
    if (carry > 0) {
        res += carry;
    }
    return res.split('').reverse().join('');
};
// @lc code=end



/*
// @lcpr case=start
// "11"\n"123"\n
// @lcpr case=end

// @lcpr case=start
// "456"\n"77"\n
// @lcpr case=end

// @lcpr case=start
// "0"\n"0"\n
// @lcpr case=end

 */

