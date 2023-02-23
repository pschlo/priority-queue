# priority-queue
Implementation of a priority queue using a min-heap internally. Two heap classes are already provided.

## Installation
This package is not currently uploaded to npm. Install as follows:

1. Find your release of choice [here](https://github.com/pschlo/priority-queue/releases)
2. Copy the link to `priority-queue-x.x.x.tgz`
3. Run `npm install {link}`

## Building
The `.tgz` file in a release was created from the source code with `npm pack`. The reason we use this command instead of simply running `tar` on the whole project is that `npm pack` obeys the [`files`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files) field in `package.json`.

## Queue types
Two types of priority queue are implemented:
1. **`KeyedQueue`**: Items are inserted with a priority, which determines the order in which items are yielded. The priorities can be updated.
2. **`ComparatorQueue`**: Items are yielded according to a comparator function. Once inserted, an items 'priority' cannot be updated (maybe this will be added later)

By default, the same item cannot exist in a heap more than once. To allow the queue to contain an item multiple times, construct the queue with `allowMultiple` set to `true`.

## Heap types
Any class that implements the `Heap` interface can be used as the internal heap of a priority queue. The heap constructor must be passed to the queue constructor.
Two types of min-heap are already implemented:
1. **`ArrayHeap`**: Nodes are stored in an array.
2. **`PointerHeap`**: Nodes store references to their parent and their children.

By default, priority queues use `ArrayHeap`. Some testing seems to suggest that it is faster than `PointerHeap`. One reason for this is that finding the last element in the heap, which is used in multiple operations, lies in `O(1)` for `ArrayHeap` and in `O(log n)` for `PointerHeap`.

## Example

Simple demonstration of `KeyedQueue`:

```typescript
let queue = new KeyedQueue<string>('DESCENDING')
queue.push('A', 1)
queue.push('B', 5)
queue.push('C', -3)
queue.push('D', 0.5)

while (!(queue.isEmpty()))
  console.log(queue.pop())

/* Output:
QueueNode { item: 'B', priority: 5 }
QueueNode { item: 'A', priority: 1 }
QueueNode { item: 'D', priority: 0.5 }
QueueNode { item: 'C', priority: -3 }
*/

queue.push('E', 7)
console.log(queue.peek())
// Output: QueueNode { item: 'E', priority: 7 }
console.log(queue.peek().item)
// Output: E
console.log(queue.peek().priority)
// Output: 7
```


Simple demonstration of `ComparatorQueue`:

```typescript
let queue = new ComparatorQueue<string>((a,b) => a.length < b.length)
queue.push('pineapple')
queue.push('pear')
queue.push('banana')
queue.push('lemon')

while (!(queue.isEmpty()))
  console.log(queue.pop())
  
/* Output:
pear
lemon
banana
pineapple
*/

queue.push('tomato')
console.log(queue.peek())
// Output: tomato
```


## Performance
For time complexity, see https://en.wikipedia.org/wiki/Binary_heap#Summary_of_running_times .

Array-based and pointer-based heaps have, in general, a similar runtime performance. However, there is a difference when locating the last node in the heap, i.e. the rightmost node in the last layer. An array-based heap can find it simply by accessing the last element in its array, which takes `O(1)` time. A pointer-based heap does not have this kind of global view on its nodes and cannot find the last node quickly. Instead, to find the `n`th node, it can convert `n` to a binary string and cut off the leftmost digit. It then interprets this as a path, where `0` stands for going down to the left child and `1` for the right child. Following this path from the root node will yield the `n`th node. If the pointer-based heap keeps track of its size, it can thereby find its last node in `O(log n)` time.

Because of this, every operation that requires knowing the position of the last heap node may take longer in the pointer-based heap than in the array-based heap. These operations include `insert`, `remove` and `extractMin`.

## Design Choices
A traditional priority queue uses an array-based heap. We wanted to generalize this and allow for different heaps to be utilized, e.g. a pointer-based one. We also noticed that there are two different kinds of priority queue used in software, and since one can be more suitable than the other in certain situations, we implemented both.

Instead of putting items in the heap directly, we store them together with their priority in more generic heap nodes. The heap then only acts on these nodes.

For `ComparatorQueue`, the priority of an item is not given explicitly. The `key` field of a heap node is thus not used. We decided that a `ComparatorQueue` should always create new heap nodes with priority `-1` as a dummy value.

### Array heap
To perform operations on a given node, the node's index in the internal array must be known. The typical array-based heap does not allow for quickly locating a node. Instead, to find a specific node, the entire array must be searched linearly, resulting in a `O(n)` runtime. This is not satisfactory, because even though basic operations like `insert`, `peekMin` and `extractMin` do not require locating arbitrary nodes, more advanced operations like `remove`, `updateKey` or checking if the heap contains a specific node do.

This is usually fixed by storing a mapping from the items to their array indices. But since our heap uses separate node objects, we simply store the nodes's index in the node itself. To allow for checking if a node is in a heap, a node also stores a reference to its heap.

### Pointer heap
Instead of an array index, a pointer heap node stores references to its parent and children.

