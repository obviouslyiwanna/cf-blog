200. 岛屿数量
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

- 深度优先搜索上下左右，可以将已经遍历过的陆地标记为已遍历，避免重复遍历。
递归版
```js
var numIslands = function (grid) {
    let ans = 0;
    const m = grid.length, n = grid[0].length;
    function dfs(i, j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') {
            return;
        }
        grid[i][j] = 'x';
        dfs(i - 1, j); 
        dfs(i + 1, j); 
        dfs(i, j - 1); 
        dfs(i, j + 1); 
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                ans++;
            }
        }
    }
    return ans;
};
```
迭代版
```js
var numIslands = function (grid) {
    let ans = 0;
    const m = grid.length, n = grid[0].length;
    if (m === 0 || n === 0) return 0;
    function dfs(i, j) {
        const stack = [[i, j]];
        while (stack.length) {
            const [x, y] = stack.pop();
            if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] !== '1') continue;
            grid[x][y] = 'x';
            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                ans++;
            }
        }
    }
    return ans;
};
```
994. 腐烂的橘子
在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一：

值 0 代表空单元格；
值 1 代表新鲜橘子；
值 2 代表腐烂的橘子。
每分钟，腐烂的橘子 周围 4 个方向上相邻 的新鲜橘子都会腐烂。

返回 直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1 。
- 对于腐烂的橘子，进入队列，每次从队列中取出一个腐烂的橘子，将其周围的新鲜橘子标记为腐烂，并将它们加入队列。
- 重复上述过程，直到队列为空。
- 最后，检查网格中是否还有新鲜橘子。如果有，返回 -1；否则，返回经过的分钟数。
```js
var orangesRotting = function (grid) {
    let rows = grid.length, columns = grid[0].length;
    const queue = [];
    let fresh = 0, minutes = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (grid[i][j] === 1) fresh++;
            if (grid[i][j] === 2) queue.push([i, j]);
        }
    }
    if (fresh === 0) return 0;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length && fresh > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const [x, y] = queue.shift();
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < rows && newY >= 0 && newY < columns && grid[newX][newY] === 1) {
                    grid[newX][newY] = 2;
                    fresh--;
                    queue.push([newX, newY]);
                }
            }
        }
        if (queue.length > 0) minutes++;
    }
    return fresh === 0 ? minutes : -1;
};
```
207. 课程表
你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。

例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。
- 拓扑排序
构建邻接表：表示课程的依赖关系

统计入度：记录每个课程的先修课程数量

初始化队列：将所有入度为0的课程入队

BFS遍历：

从队列取出课程

减少依赖该课程的后续课程的入度

如果入度减为0，加入队列

检查结果：如果所有课程都被处理，也就是说处理的课程数量等于总课程数量，则无环；否则有环

```js
var canFinish = function (numCourses, prerequisites) {
    const graph = new Array(numCourses).fill(0).map(() => []);
    const inDegree = new Array(numCourses).fill(0);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }

    let count = 0;
    while (queue.length) {
        const current = queue.shift();
        count++;
        for (const nextCourse of graph[current]) {
            inDegree[nextCourse]--;
            if(inDegree[nextCourse] === 0) queue.push(nextCourse);
        }
    }

    return count === numCourses;
};
```


改进：三色判断环法   

初始化所有节点为未访问(0)

对每个未访问节点启动DFS

在DFS中：

将当前节点标记为访问中(1)

递归访问所有邻居节点

如果在递归中遇到访问中的节点→发现环→返回true

完成所有邻居访问后，将节点标记为已访问(2)

如果所有DFS都完成且没发现环→返回false

课程表的环的情况应该是false，无环的情况应该是true，因为是拓扑序列

```js
var canFinish = function (numCourses, prerequisites) {
    const graph = new Array(numCourses).fill(0).map(() => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    const visited = new Array(numCourses).fill(0); // 0 not visited; 1 visiting; 2visited
    function hasCycle(courses) {
        if (visited[courses] === 1) return true;
        if (visited[courses] === 2) return false;

        visited[courses] = 1;
        for (const nextCourse of graph[courses]) {
            if (hasCycle(nextCourse)) return true;


        } 
        visited[courses] = 2;
        return false;
    }
    for (let i = 0; i < numCourses; i++) {
        if (hasCycle(i)) return false;
    }
    return true;
};
```
210.课程2
输出序列 每次shift的时候用order结果数组去接一下
```js
var findOrder = function(numCourses, prerequisites) {
    const graph = new Array(numCourses).fill(0).map(() => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    const order = [];
    while (queue.length) {
        const current = queue.shift(); 
        order.push(current);
        
        for (const nextCourse of graph[current]) {
            inDegree[nextCourse]--;
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    return order.length === numCourses ? order : [];
};
```

208. 实现 Trie (前缀树)
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

Trie() 初始化前缀树对象。
void insert(String word) 向前缀树中插入字符串 word 。
boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。

```js
// Trie节点类
class TrieNode {
    constructor() {
        this.children = new Map();  // 使用Map存储子节点，键是字符，值是子TrieNode
        this.isEnd = false;       // 标记当前节点是否是某个单词的结尾
    }
}

// Trie树类
class Trie {
    constructor() {
        this.root = new TrieNode();  // 创建根节点
    }

    // 向Trie中插入一个单词
    insert(word) {
        let node = this.root;  // 从根节点开始
        for (const char of word) {  // 遍历单词的每个字符
            if (!node.children.has(char)) {  // 如果当前字符不存在于子节点中
                node.children.set(char, new TrieNode());  // 创建一个新的子节点
            }
            node = node.children.get(char);  // 移动到对应的子节点
        }
        node.isEnd = true;  // 标记最后一个节点为单词结尾
    }

    // 私有方法：沿着给定单词遍历Trie，返回最终节点或null
    #traverse(word) {
        let node = this.root;  // 从根节点开始
        for (const char of word) {  // 遍历单词的每个字符
            if (!node.children.has(char)) return null;  // 如果字符不存在，返回null
            node = node.children.get(char);  // 移动到对应的子节点
        }
        return node;  // 返回最终到达的节点
    }

    // 搜索完整单词是否存在于Trie中
    search(word) {
        const node = this.#traverse(word);  // 获取单词对应的节点
        return node !== null && node.isEnd;  // 节点存在且是单词结尾才返回true
    }

    // 检查Trie中是否有以给定前缀开头的单词
    startsWith(prefix) {
        return this.#traverse(prefix) !== null;  // 只要前缀对应的路径存在就返回true
    }
}

```
