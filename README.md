# priorityQueue
Two heap-based implementations of a priority queue

## Queue types
Two types of priority queue are implemented:
1. **Keyed queues**: Items are inserted with a priority. Extracting items also yields the priority. The priority can be updated.
2. **Comparator queues**: Items are sorted according to a comparator function. Once inserted, an items 'priority' cannot be updated (maybe this will be added later)

By default, the same item cannot exist in a heap more than once. To allow the queue to contain an item multiple times, construct the queue with `allowMultiple` set to `true`.

## Heap types
Two types of heap can be used internally:
1. **Array-based heap**: Nodes are stored in an array.
2. **Pointer-based heap**: Nodes store references to their parent and their children.

The heap type can be specified in the constructor. By default, priority queues use array-based heaps. Some testing showed that the array-based heap implementation seems to be the faster option.

## Example

Simple demonstration of the keyed priority queue:

```typescript
let queue = new KeyedPriorityQueue<string>()
queue.push('A', 1)
queue.push('B', 5)
queue.push('C', -3)
queue.push('D', 0.5)

while (!(queue.isEmpty()))
  console.log(queue.pop())
  
/* Output:
PriorityQueueItem { item: 'C', priority: -3 }
PriorityQueueItem { item: 'D', priority: 0.5 }
PriorityQueueItem { item: 'A', priority: 1 }
PriorityQueueItem { item: 'B', priority: 5 }
*/

queue.push('E', 7)
console.log(queue.peek())
// Output: PriorityQueueItem { item: 'E', priority: 7 }
console.log(queue.peek().item)
// Output: E
console.log(queue.peek().priority)
// Output: 7
```


Simple demonstration of the comparator priority queue:

```typescript
let queue = new ComparatorPriorityQueue<string>((a,b) => a.length < b.length)
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
