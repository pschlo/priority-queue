
import { ComparatorHeapQueue, HeapConstructor, KeyHeapQueue, NodeConstructor } from "./abstractPriorityQueue"
import { ArrayHeap, ArrayNode } from "./arrayHeap"
import { PointerHeap, PointerNode } from "./pointerHeap"


const TYPE_TO_HEAP = new Map<string, [HeapConstructor<any>, NodeConstructor<any,any>]>([
    ['ARRAY', [ArrayHeap, ArrayNode]],
    ['POINTER', [PointerHeap, PointerNode]]
])


export class KeyPriorityQueue<Item> extends KeyHeapQueue<Item, any> {
    constructor(allowMultiple:boolean=false, type:'ARRAY'|'POINTER'='ARRAY') {
        const [heapConstructor, nodeConstructor] = TYPE_TO_HEAP.get(type)!
        super(heapConstructor, nodeConstructor, allowMultiple)
    }
}

export class CustomPriorityQueue<Item> extends ComparatorHeapQueue<Item, any> {
    constructor(allowMultiple:boolean=false, isBefore:(a:Item,b:Item)=>boolean, type:'ARRAY'|'POINTER'='ARRAY') {
        const [heapConstructor, nodeConstructor] = TYPE_TO_HEAP.get(type)!
        super(heapConstructor, nodeConstructor, isBefore, allowMultiple)
    }
}
