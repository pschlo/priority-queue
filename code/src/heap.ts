import { type Item } from "./abstractPriorityQueue"



export interface HeapNode<T> {
    item: T
    key: number
}


// Heap that acts on an arbitrary but fixed type of HeapNode
// must have parameter Node, because a Heap never acts on *all* kinds of HeapNode, but only on a *specific* kind
export interface Heap<Node extends HeapNode<any>> {
    createNode(item:Item<Node>, key:number): Node
    isLess: (a: Node , b: Node) => boolean
    size(): number
    insert(node: Node): void
    remove(node: Node): void
    extractMin(): Node
    peekMin(): Node
    updateKey(node: Node, key: number): void
}


export class HeapError extends Error { }

export class InvalidNodeError extends HeapError { }
export class EmptyHeapError extends HeapError { }