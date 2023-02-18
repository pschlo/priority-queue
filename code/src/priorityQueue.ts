
import { ComparatorHeapQueue, HeapConstructor, Item, Node, KeyHeapQueue, NodeConstructor } from "./abstractPriorityQueue"
import { ArrayHeap, ArrayNode } from "./arrayHeap"
import { Heap } from "./heap"
import { PointerHeap, PointerNode } from "./pointerHeap"
import { ConstructorReturnType } from "./utils"



const a = new KeyHeapQueue(PointerHeap<string>, false)

const b = new ComparatorHeapQueue(ArrayHeap<number>, (a,b) => a < b)





// const TYPE_TO_HEAP = new Map([
//     ['ARRAY', ArrayHeap],
//     ['POINTER', PointerHeap]
// ])

// type HeapConstructors<T> = 

function getHeapConstructor<_Item>(heapType:string): HeapConstructor<ArrayHeap<_Item>> | HeapConstructor<PointerHeap<_Item>> {
    switch (heapType) {
        case 'ARRAY':
            return ArrayHeap<_Item>
        case 'POINTER':
            return PointerHeap<_Item>
        default:
            heapType as never
            throw new Error('Invalid heap type')
    }
}


export function createKeyedQueue<_Item>(allowMultiple=false, heapType:'ARRAY'|'POINTER'='ARRAY') {
    const heapConstructor = getHeapConstructor<_Item>(heapType)
    return new KeyHeapQueue(ArrayHeap<string>, allowMultiple)
}

const c = createKeyedQueue<string>(false, 'ARRAY')
c.push


// export class KeyedPriorityQueue<Item> extends KeyHeapQueue<any> {
//     constructor(allowMultiple=false, type:'ARRAY'|'POINTER'='ARRAY') {
//         const [heapConstructor, nodeConstructor] = TYPE_TO_HEAP.get(type)!
//         super(heapConstructor, nodeConstructor, allowMultiple)
//     }
// }

// export class ComparatorPriorityQueue<Item> extends ComparatorHeapQueue<Item, any> {
//     constructor(isBefore:(a:Item,b:Item)=>boolean, allowMultiple=false, type:'ARRAY'|'POINTER'='ARRAY') {
//         const [heapConstructor, nodeConstructor] = TYPE_TO_HEAP.get(type)!
//         super(heapConstructor, nodeConstructor, isBefore, allowMultiple)
//     }
// }
