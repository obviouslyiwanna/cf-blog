215. 数组中的第 K 个最大元素
     给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

- 三分区（big, equal, small） 来递归查找第 k 大的元素。
  如果 k 小于等于 big 数组的长度，那么第 k 大的元素在 big 数组中，递归查找 big 数组。
  如果 k 大于等于 nums 数组的长度减去 small 数组的长度，那么第 k 大的元素在 small 数组中，递归查找 small 数组。
  否则，第 k 大的元素在 equal 数组中，直接返回 pivot。

```js
var findKthLargest = function (nums, k) {
  const quickSelect = (nums, k) => {
    const pivot = nums[Math.floor(Math.random() * nums.length)]

    const big = [],
      equal = [],
      small = []
    for (const num of nums) {
      if (num > pivot) big.push(num)
      else if (num < pivot) small.push(num)
      else equal.push(num)
    }

    if (k <= big.length) {
      return quickSelect(big, k)
    } else if (nums.length - small.length < k) {
      return quickSelect(small, k - (big.length + equal.length))
    } else {
      return pivot
    }
  }
  return quickSelect(nums, k)
}
```

// 手写堆

```js
class MinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    push(val) {
        this.heap.push(val);
        this._siftUp(this.heap.length - 1);
    }

    pop() {
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._siftDown(0);
        }
        return top;
    }

    _siftUp(index) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[index] < this.heap[parent]) {
            [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }

    _siftDown(index) {
        const n = this.heap.length;
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
            if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}
```

347. 前 K 个高频元素
     给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。

- 先去统计每个元素的频率，记录在一个 map 中，然后再把具有相同频率的元素放在一个桶里

```js
var topKFrequent = function (nums, k) {
  const count = new Map()
  for (const x of nums) {
    count.set(x, (count.get(x) ?? 0) + 1)
  }
  const maxCount = Math.max(...count.values())

  const buckets = Array.from({ length: maxCount + 1 }, () => [])
  for (const [x, c] of count.entries()) {
    buckets[c].push(x)
  }

  const ans = []
  for (let i = maxCount; i >= 0 && ans.length < k; i--) {
    ans.push(...buckets[i])
  }
  return ans
}
```

- 最小堆

```js
class MinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    push(val) {
        this.heap.push(val);
        this._siftUp(this.heap.length - 1);
    }

    pop() {
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._siftDown(0);
        }
        return top;
    }

    _siftUp(idx) {
        let parent = Math.floor((idx - 1) / 2);
        while (idx > 0 && this.heap[idx][1] < this.heap[parent][1]) {
            [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
            idx = parent;
            parent = Math.floor((idx - 1) / 2);
        }
    }

    _siftDown(idx) {
        const n = this.heap.length;
        while (true) {
            let smallest = idx;
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;

            if (left < n && this.heap[left][1] < this.heap[smallest][1]) smallest = left;
            if (right < n && this.heap[right][1] < this.heap[smallest][1]) smallest = right;

            if (smallest === idx) break;

            [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
            idx = smallest;
        }
    }
}

var topKFrequent = function(nums, k) {
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    const heap = new MinHeap();

    for (const [num, freq] of freqMap.entries()) {
        heap.push([num, freq]);
        if (heap.size() > k) heap.pop(); // 保持堆大小为 k
    }

    const res = [];
    while (heap.size() > 0) {
        res.push(heap.pop()[0]);
    }
    return res;
};
```

295. 数据流的中位数
     中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

例如 arr = [2,3,4] 的中位数是 3 。
例如 arr = [2,3] 的中位数是 (2 + 3) / 2 = 2.5 。
实现 MedianFinder 类:

MedianFinder() 初始化 MedianFinder 对象。

void addNum(int num) 将数据流中的整数 num 添加到数据结构中。

double findMedian() 返回到目前为止所有元素的中位数。与实际答案相差 10-5 以内的答案将被接受。
示例 1：

输入
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
输出
[null, null, null, 1.5, null, 2.0]

解释
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1); // arr = [1]
medianFinder.addNum(2); // arr = [1, 2]
medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)
medianFinder.addNum(3); // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0

- 对顶堆，left 是最大堆，right 是最小堆。

- 维护两个堆，left 是最大堆，right 是最小堆。
- 当 left 为空时，直接将 num 加入 left。
- 当 left 不为空时，判断 num 是否大于 left 的堆顶。
  - 如果大于，将 num 加入 right。
  - 如果小于等于，将 num 加入 left。
- 当 left 的大小大于 right 的大小加 1 时，将 left 的堆顶加入 right。
- 当 left 的大小小于 right 的大小时，将 right 的堆顶加入 left。

如果当前有奇数个元素，中位数是 left 的堆顶。
如果当前有偶数个元素，中位数是 left 的堆顶和 right 的堆顶的平均值。

```js
var MedianFinder=function(){
    this.left=new MaxPriorityQueue();
    this.right=new MinPriorityQueue();
}

MedianFinder.prototype.addNum=function(num){
    if(this.left.size()===this.right.size()){
        this.right.enqueue(num);
        this.left.enqueue(this.right.dequeue());
    }else{
        this.left.enqueue(num);
        this.right.enqueue(this.left.dequeue());
    }
}

MedianFinder.prototype.findMedian=function(){
    if(this.left.size()>this.right.size()){
        return this.left.front();
    }else{
        return (this.left.front()+this.right.front())/2;
    }
}
```
