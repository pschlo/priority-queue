import { ArrayHeap } from "./arrayHeap"
import { Heap as IHeap, HeapNode } from "./heap"
import { PointerHeap } from "./pointerHeap"


export class PriorityQueueItem<T> {
    item: T
    priority: number

    constructor(item:T, priority:number) {
        this.item = item
        this.priority = priority
    }
}


// type definitions

// constructs any Heap that uses a specific kind of node
export type HeapConstructor<Heap extends IHeap<any>> = new (isLess?: (a:Node<Heap>,b:Node<Heap>)=>boolean) => Heap
// constructs a specific kind of node
export type NodeConstructor<Node extends HeapNode<any>> = new (item:Item<Node>,key:number) => Node


type _Node<Heap extends IHeap<any>> = Heap extends IHeap<infer _Node> ? _Node : never
export type Node<Heap extends IHeap<any>> = _Node<Heap> & HeapNode<Item<_Node<Heap>>>

export type Item<Node extends HeapNode<any>> = Node extends HeapNode<infer Item> ? Item : never



export abstract class BaseHeapQueue<Heap extends IHeap<any>> {
    protected readonly heap: Heap
    protected allowMultiple: boolean

    // keep track of the nodes that contain the same item
    protected readonly itemToNodes: Map<Item<Node<Heap>>, Set<Node<Heap>>> = new Map()

    constructor(heap: Heap, allowMultiple=false) {
        this.heap = heap
        this.allowMultiple = allowMultiple
    }

    protected getItemNodes(item:Item<Node<Heap>>): Set<Node<Heap>> | undefined {
        const nodes = this.itemToNodes.get(item)
        return nodes
    }

    protected addItemNode(item:Item<Node<Heap>>, node:Node<Heap>) {
        let nodes = this.itemToNodes.get(item)
        if (nodes == null) {
            nodes = new Set()
            this.itemToNodes.set(item, nodes)
        }
        nodes.add(node)
    }

    protected removeItemNode(item:Item<Node<Heap>>, node:Node<Heap>) {
        let nodes = this.itemToNodes.get(item)
        if (nodes == null) throw new Error('Item not in heap')
        if (!(nodes.has(node))) throw new Error('Node not in item nodes')
        nodes.delete(node)
        if (nodes.size === 0)
            this.itemToNodes.delete(item)
    }

    size(): number {
        return this.heap.size()
    }

    isEmpty(): boolean {
        return this.size() === 0
    }

    contains(item: Item<Node<Heap>>): boolean {
        const nodes = this.getItemNodes(item)
        return nodes != null
    }

    count(item: Item<Node<Heap>>): number {
        const nodes = this.getItemNodes(item)
        if (nodes == null)
            return 0
        else
            return nodes.size
    }

    // deletes all nodes containing the item
    delete(item:Item<Node<Heap>>): void {
        const nodes = this.getItemNodes(item)
        if (nodes == null) throw new Error('Queue does not contain item')
        for (const node of nodes) {
            this.removeItemNode(item, node)
            this.heap.remove(node)
        }
    }

    abstract push(...args:any): void
    abstract peek(): any
    abstract pop(): any

}
//type MyNode<Heap extends IHeap<any>, Item> = Node<Heap> & (Node<Heap> extends HeapNode<Item> ? Node<Heap> : never)

export class KeyHeapQueue<Heap extends IHeap<any>> extends BaseHeapQueue<Heap> {
    constructor(heapConstructor: HeapConstructor<Heap>,
                allowMultiple=false) {

        super(new heapConstructor(), allowMultiple)
    }

    override push(item:Item<Node<Heap>>, priority:number): void {
        if (!(this.allowMultiple) && this.contains(item)) throw new Error('Item already exists in heap')
        const node = this.heap.createNode(item, priority)
        this.addItemNode(item, node)
        this.heap.insert(node)
    }

    override peek(): PriorityQueueItem<Item<Node<Heap>>> {
        const node = this.heap.peekMin()
        return new PriorityQueueItem(node.item, node.key)
    }

    override pop(): PriorityQueueItem<Item<Node<Heap>>> {
        const node = this.heap.extractMin()
        this.removeItemNode(node.item, node)
        return new PriorityQueueItem(node.item, node.key)
    }

    update(item:Item<Node<Heap>>, priority:number): void {
        if (this.allowMultiple) throw new Error('Cannot update on queue with allowMultiple set')
        const nodes = this.getItemNodes(item)
        if (nodes == null) throw new Error('Queue does not contain item')
        const [node] = nodes
        this.heap.updateKey(node, priority)
    }
}


export class ComparatorHeapQueue<Heap extends IHeap<any>> extends BaseHeapQueue<Heap> {
    constructor(heapConstructor: HeapConstructor<Heap>,
                isBefore: (a:Item<Node<Heap>>,b:Item<Node<Heap>>)=>boolean,
                allowMultiple=false) {

        const isLess = (a:Node<Heap>,b:Node<Heap>) => isBefore(a.item, b.item)
        super(new heapConstructor(isLess), allowMultiple)
    }

    override push(item:Item<Node<Heap>>): void {
        if (!(this.allowMultiple) && this.contains(item)) throw new Error('Item already exists in heap')
        const node = this.heap.createNode(item, -1)
        this.addItemNode(item, node)
        this.heap.insert(node)
    }

    override peek(): Item<Node<Heap>> {
        const node = this.heap.peekMin()
        return node.item
    }

    override pop(): Item<Node<Heap>> {
        const node = this.heap.extractMin()
        this.removeItemNode(node.item, node)
        return node.item
    }
}
