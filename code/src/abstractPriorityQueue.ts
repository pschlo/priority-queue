import { getRandItem } from "./utils"
import { Heap, HeapNode } from "./heap"


export class PriorityQueueItem<T> {
    item: T
    priority: number

    constructor(item:T, priority:number) {
        this.item = item
        this.priority = priority
    }
}


// Queue that acts on a type of item and a type of node
export abstract class BaseHeapQueue<Item, _Node extends HeapNode<Item>> {
    protected readonly heap: Heap<_Node>
    protected abstract readonly nodeConstructor: new (item:Item,key:number)=>_Node
    protected allowMultiple: boolean

    // keep track of the nodes that contain the same item
    protected readonly itemToNodes: Map<Item, Set<_Node>> = new Map()

    constructor(heap: Heap<_Node>, allowMultiple=false) {
        this.heap = heap
        this.allowMultiple = allowMultiple
    }

    protected getItemNodes(item:Item): Set<_Node> | undefined {
        const nodes = this.itemToNodes.get(item)
        return nodes
    }

    protected addItemNode(item:Item, node:_Node) {
        let nodes = this.itemToNodes.get(item)
        if (nodes == null) {
            nodes = new Set()
            this.itemToNodes.set(item, nodes)
        }
        nodes.add(node)
    }

    protected removeItemNode(item:Item, node:_Node) {
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

    contains(item: Item): boolean {
        const nodes = this.getItemNodes(item)
        return nodes != null
    }

    // deletes all nodes containing the item
    delete(item:Item): void {
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


export abstract class KeyHeapQueue<Item, _Node extends HeapNode<Item>> extends BaseHeapQueue<Item, _Node> {
    constructor(heapConstructor: new (isLess?: (a:_Node,b:_Node)=>boolean) => Heap<_Node>, allowMultiple=false) {
        super(new heapConstructor(), allowMultiple)
    }

    override push(item:Item, priority:number): void {
        if (!(this.allowMultiple) && this.contains(item)) throw new Error('Item already exists in heap')
        const node = new this.nodeConstructor(item, priority)
        this.addItemNode(item, node)
        this.heap.insert(node)
    }

    override peek(): PriorityQueueItem<Item> {
        const node = this.heap.peekMin()
        return new PriorityQueueItem(node.item, node.key)
    }

    override pop(): PriorityQueueItem<Item> {
        // TODO update mapping
        const node = this.heap.extractMin()
        return new PriorityQueueItem(node.item, node.key)
    }

    update(item:Item, priority:number): void {
        if (this.allowMultiple) throw new Error('Cannot update on queue with allowMultiple set')
        const nodes = this.getItemNodes(item)
        if (nodes == null) throw new Error('Queue does not contain item')
        const [node] = nodes
        this.heap.updateKey(node, priority)
    }
}


export abstract class ComparatorHeapQueue<Item, _Node extends HeapNode<Item>> extends BaseHeapQueue<Item, _Node> {
    constructor(heapConstructor: new (isLess?: (a:_Node,b:_Node)=>boolean) => Heap<_Node>, isBefore: (a:Item,b:Item)=>boolean, allowMultiple=false) {
        const isLess = (a:_Node,b:_Node) => isBefore(a.item, b.item)
        super(new heapConstructor(isLess), allowMultiple)
    }

    override push(item:Item): void {
        if (!(this.allowMultiple) && this.contains(item)) throw new Error('Item already exists in heap')
        const node = new this.nodeConstructor(item, -1)
        this.addItemNode(item, node)
        this.heap.insert(node)
    }

    override peek(): Item {
        const node = this.heap.peekMin()
        return node.item
    }

    override pop(): Item {
        // TODO update mapping
        const node = this.heap.extractMin()
        return node.item
    }
}
