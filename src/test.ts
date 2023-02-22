import { ComparatorQueue, KeyedQueue } from "./priorityQueue";
import ArrayHeap from "./arrayHeap";
import PointerHeap from "./pointerHeap";
import { randInt } from "./utils"


function randString(min:number=1, max:number=5) {
    const length = randInt(min, max)
    let result = '';
    //const chars = 'A'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i=0; i < length; i++)
      result += chars[randInt(0, chars.length)];
    return result;
}

function randPrio() {
    return randInt(-1000000, 1000000)
}


function isBefore(a:string, b:string) {
    return a.length < b.length
}


function testComparators() {
    const compArray = new ComparatorQueue<string>(isBefore)
    const compPointer = new ComparatorQueue<string>(isBefore)

    for (let i=0; i<1000; i++) {
        const str = randString(1,30)
        compArray.push(str)
        compPointer.push(str)
    }
    console.log(compArray.size())
    console.log(compPointer.size())

    while (!(compArray.isEmpty())) {
        // console.log(compArray.count('A'))
        const arrayItem = compArray.pop()
        const pointerItem = compPointer.pop()
        if (!(arrayItem === pointerItem)) throw new Error('Not same!')
        console.log(arrayItem)
    }
    console.log(compArray.size())
    console.log(compPointer.size())
    // console.log(compPointer.itemToNodes.size)
}


function testKeyed() {
    const MAX_LEN = 4

    const keyArray = new KeyedQueue<string>()
    const keyPointer = new KeyedQueue<string>()

    for (let i=0; i<10; i++) {
        const str = randString(1,MAX_LEN)
        const prio = randPrio()
        keyArray.push(str, prio)
        keyPointer.push(str, prio)
    }
    console.log(keyArray.size())
    console.log(keyPointer.size())

    while (!(keyArray.isEmpty())) {
        // console.log(keyArray.count('A'))
        const arrayItem = keyArray.pop()
        const pointerItem = keyPointer.pop()
        if (!(arrayItem.item === pointerItem.item) || !(arrayItem.priority === pointerItem.priority)) throw new Error('Not same!')
        console.log(`${arrayItem.item.padEnd(MAX_LEN)} (${arrayItem.priority})`)
    }
    console.log(keyArray.size())
    console.log(keyPointer.size())
}







export default async function main() {
    // testComparators()
    let queue = new KeyedQueue<string>('DESCENDING')
queue.push('A', 1)
queue.push('B', 5)
queue.push('C', -3)
queue.push('D', 0.5)

while (!(queue.isEmpty()))
  console.log(queue.pop())
  
/* Output:
PriorityQueueItem { item: 'B', priority: 5 }
PriorityQueueItem { item: 'A', priority: 1 }
PriorityQueueItem { item: 'D', priority: 0.5 }
PriorityQueueItem { item: 'C', priority: -3 }
PriorityQueueItem { item: 'E', priority: 7 }
*/

queue.push('E', 7)
console.log(queue.peek())
// Output: PriorityQueueItem { item: 'E', priority: 7 }
console.log(queue.peek().item)
// Output: E
console.log(queue.peek().priority)
// Output: 7
}

