160. 相交链表
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。
- 思路：初始化两个指针 pA 和 pB，分别指向 headA 和 headB。
同时移动 pA 和 pB，每次各移动一步。
当 pA 到达链表 A 的末尾时，将其重定向到 headB；同理，当 pB 到达链表 B 的末尾时，将其重定向到 headA。
如果 pA 和 pB 相遇，则该节点就是相交节点；如果它们都到达末尾（即 null），则说明没有相交。
```js
var getIntersectionNode = function (headA, headB) {
    if (!headA || !headB) return null;
    let pA = headA, pB = headB;
    while (pA !== pB) {
        pA = pA === null ? headB : pA.next;
        pB = pB === null ? headA : pB.next;
    }
    return pA;
};
```
206. 反转链表
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
- 思路：初始化三个指针 prev、curr 和 next，分别指向 null、head 和 head.next。
遍历链表，将 curr.next 指向 prev，然后将 prev、curr 和 next 分别向右移动一步。
重复上述步骤，直到 curr 为 null。
返回 prev，即为反转后的链表头节点。
```js
var reverseList = function (head) {
    let prev = null, curr = head, next = null;
    while (curr !== null) {
        next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
};
```
234. 回文链表
给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
- 快慢指针 + 反转后半部分 再去比较 空间复杂度是 O(1)；也可以是遍历完一遍链表存在数组里再用双指针比较 这样的话空间复杂度是O(n)
```js
var isPalindrome = function (head) {
    if (!head || !head.next) return true;
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let pre = null, cur = slow, next = null;
    while (cur) {
        next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    const reversedHead = pre;

    let p1 = head, p2 = reversedHead;
    while (p2) {
        if (p1.val !== p2.val) return false;
        p1 = p1.next;
        p2 = p2.next;
    }
    return true;
};
```

141. 环形链表
给你一个链表的头节点 head ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。

如果链表中存在环 ，则返回 true 。 否则，返回 false 。
- 直接用快慢指针，如果有环，快慢指针最终会相遇
```js
var hasCycle = function (head) {
    let fast = head, slow = head;
    while (fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
        if (slow === fast) return true;
    }
    return false;
};
```
142. 环形链表 II
给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改 链表。
- 快慢指针相遇后，将慢指针指向头节点，快指针指向相遇点，然后两个指针同时移动一步，直到它们再次相遇，相遇点就是入环的第一个节点。
```js
var detectCycle = function (head) {
    let fast = head, slow = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            while (slow !== head) {
                slow = slow.next;
                head = head.next;
            }
            return slow;
        }
    }

    return null;
};
```