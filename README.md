# priorityQueue
Implementation of a priority queue using a min-heap internally. Two heap classes are already provided.

## Queue types
Two types of priority queue are implemented:
1. **`KeyedQueue`**: Items are inserted with a priority, which determines the order in which items are yielded. The priorities can be updated.
2. **`ComparatorQueue`**: Items are yielded according to a comparator function. Once inserted, an items 'priority' cannot be updated (maybe this will be added later)

By default, the same item cannot exist in a heap more than once. To allow the queue to contain an item multiple times, construct the queue with `allowMultiple` set to `true`.

## Heap types
Any class that implements the `Heap` interface can be used as the internal heap of a priority queue. The heap constructor must be passed to the queue constructor.
Two types of heap are already implemented:
1. **`ArrayHeap`**: Nodes are stored in an array.
2. **`PointerHeap`**: Nodes store references to their parent and their children.

By default, priority queues use array-based heaps. Some testing seems to suggest that the array-based heap implementation is faster than the pointer-based heap.

## Example

Simple demonstration of the keyed priority queue:

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


Simple demonstration of the comparator priority queue:

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
