
import { ComparatorHeapQueue, KeyHeapQueue } from "./abstractPriorityQueue"
import { ArrayHeap, ArrayNode } from "./arrayHeap"
import { PointerMinHeap, PointerNode } from "./pointerHeap"


export class ComparatorArrayQueue<Item> extends ComparatorHeapQueue<Item, ArrayNode<Item>> {
    protected nodeConstructor = ArrayNode

    constructor(isBefore: (a:Item,b:Item)=>boolean, allowMultiple=false) {
        super(ArrayHeap, isBefore, allowMultiple)
    }
}

export class KeyArrayQueue<Item> extends KeyHeapQueue<Item, ArrayNode<Item>> {
    protected nodeConstructor = ArrayNode

    constructor(allowMultiple=false) {
        super(ArrayHeap, allowMultiple)
    }
}


export class ComparatorPointerQueue<Item> extends ComparatorHeapQueue<Item, PointerNode<Item>> {
    protected nodeConstructor = PointerNode

    constructor(isBefore: (a:Item,b:Item)=>boolean, allowMultiple=false) {
        super(PointerMinHeap, isBefore, allowMultiple)
    }
}

export class KeyPointerQueue<Item> extends KeyHeapQueue<Item, PointerNode<Item>> {
    protected nodeConstructor = PointerNode

    constructor(allowMultiple=false) {
        super(PointerMinHeap, allowMultiple)
    }
}
