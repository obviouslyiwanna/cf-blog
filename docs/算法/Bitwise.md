191. 位1的个数(汉明重量)
给定一个正整数 n，编写一个函数，获取一个正整数的二进制形式并返回其二进制表达式中 设置位 的个数（也被称为汉明重量）。
- 方法一：位运算
```js
var hammingWeight = function (n) {
    let res = 0;
    //每次按位与该数-1，就会消除一个1 直到最后等于0为止
    // eg:1011&1010=1010 
    // 1010&1001=1000 
    // 1000&0111=0000
    while (n) {
        res++;
        n &= (n - 1);
    }
    return res;
};
```
136. 只出现一次的数字
给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
- 方法一：位运算 异或两个相同的数，会抵消
```js
var singleNumber = function (nums) {
    let res = 0;
    for (let i = 0; i < nums.length; i++) {
        res ^= nums[i];
    }
    return res;
};
```
137. 只出现一次的数字 II
给你一个整数数组 nums ，除某个元素仅出现 一次 外，其余每个元素都恰出现 三次 。请你找出并返回那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法且使用常数级空间来解决此问题。

- 将每个数想象成32位的二进制，对于每一位的二进制的1和0累加起来必然是3N或者3N+1， 为3N代表目标值在这一位没贡献，3N+1代表目标值在这一位有贡献(=1)，然后将所有有贡献的位|起来就是结果。这样做的好处是如果题目改成K个一样，只需要把代码改成cnt%k，很通用

```JS
var singleNumber = function (nums) {
    let ans = 0;
    for (let i = 0; i < 32; i++) {
        let count = 0;
        // 计算每一位上1的个数
        for (const x of nums) {
            count += x >> i & 1;
        }
        // | 运算直接累出结果
        ans |= count % 3 << i;
    }
    return ans;
};
```
201. 数字范围按位与
给你两个整数 left 和 right ，表示区间 [left, right] ，返回此区间内所有数字 按位与 的结果（包含 left 、right 端点）。
```js
var rangeBitwiseAnd = function(left, right) {
    while (right > left) {
        right &= (right - 1);
    }
    return right;
};
```
- 优雅解法：寻找公共前缀
观察规律：区间内所有数字的按位与结果，等于它们的二进制公共前缀，后面补零。
公共前缀：left 和 right 的二进制形式从高位到低位的最长相同前缀。

右移直到相等：不断右移 left 和 right，直到它们相等，此时剩下的部分就是公共前缀。

左移恢复位数：将公共前缀左移之前右移的次数，得到最终结果。

```js
var rangeBitwiseAnd = function (left, right) {
    let shift = 0;
    while (left < right) {
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
};
```
