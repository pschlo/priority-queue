import ArrayHeap from "./arrayHeap"
import { Heap as IHeap, HeapNode } from "./heap"


export class QueueNode<T> {
    item: T
    priority: number

    constructor(item:T, priority:number) {
        this.item = item
        this.priority = priority
    }
}


// type definitions

// inference types
type _Node<Heap extends IHeap<any>> = Heap extends IHeap<infer _Node> ? _Node : never
export type Node<Heap extends IHeap<any>> = _Node<Heap> & HeapNode<Item<_Node<Heap>>>
export type Item<Node extends HeapNode<any>> = Node extends HeapNode<infer Item> ? Item : never

// constructs any Heap that uses a specific kind of node
export type HeapConstructor<Heap extends IHeap<any>> = new (isLess?: (a:Node<Heap>,b:Node<Heap>)=>boolean) => Heap
// constructs a specific kind of node
export type NodeConstructor<Node extends HeapNode<any>> = new (item:Item<Node>,key:number) => Node



abstract class BaseQueue<Item> {
    protected readonly heap: IHeap<HeapNode<Item>>
    protected allowMultiple: boolean

    // keep track of the nodes that contain the same item
    protected readonly itemToNodes: Map<Item, Set<HeapNode<Item>>> = new Map()

    constructor(heap: IHeap<any>, allowMultiple=false) {
        this.heap = heap
        this.allowMultiple = allowMultiple
    }

    protected getItemNodes(item:Item): Set<HeapNode<Item>> | undefined {
        const nodes = this.itemToNodes.get(item)
        return nodes
    }

    protected addItemNode(item:Item, node:HeapNode<Item>) {
        let nodes = this.itemToNodes.get(item)
        if (nodes == null) {
            nodes = new Set()
            this.itemToNodes.set(item, nodes)
        }
        nodes.add(node)
    }

    protected removeItemNode(item:Item, node:HeapNode<Item>) {
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

    count(item: Item): number {
        const nodes = this.getItemNodes(item)
        if (nodes == null)
            return 0
        else
            return nodes.size
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


/**
 * Priority queue that yields items according to the priority they are inserted with.
 */
export class KeyedQueue<Item> extends BaseQueue<Item> {
    private readonly order: 'ASCENDING'|'DESCENDING'

    /**
     *
     * @param order Whether the items should be yielded in ascending or descending order of their priority. Default is `ASCENDING`.
     * @param allowMultiple Whether an item can exist in the queue more than once. Default is `false`.
     * @param heapConstructor Constructor for creating a new heap. Default is a constructor that creates an `ArrayHeap` instance.
     */
    constructor(order:'ASCENDING'|'DESCENDING' = 'ASCENDING',
                allowMultiple=false,
                heapConstructor: HeapConstructor<IHeap<any>> = ArrayHeap) {

        super(new heapConstructor(), allowMultiple)
        this.order = order
    }

    override push(item:Item, priority:number): void {
        if (!(this.allowMultiple) && this.contains(item)) throw new Error('Item already exists in heap')
        if (this.order === 'DESCENDING') priority = -priority
        const node = this.heap.createNode(item, priority)
        this.addItemNode(item, node)
        this.heap.insert(node)
    }

    override peek(): QueueNode<Item> {
        const node = this.heap.peekMin()
        const priority = this.order === 'DESCENDING' ? -node.key : node.key
        return new QueueNode(node.item, priority)
    }

    override pop(): QueueNode<Item> {
        const node = this.heap.extractMin()
        const priority = this.order === 'DESCENDING' ? -node.key : node.key
        this.removeItemNode(node.item, node)
        return new QueueNode(node.item, priority)
    }

    update(item:Item, priority:number): void {
        if (this.allowMultiple) throw new Error('Cannot update on queue with allowMultiple set')
        const nodes = this.getItemNodes(item)
        if (nodes == null) throw new Error('Queue does not contain item')
        if (this.order === 'DESCENDING') priority = -priority
        const [node] = nodes
        this.heap.updateKey(node, priority)
    }
}


/**
 * Priority queue that yields items according to the given comparator function.
 */
export class ComparatorQueue<Item> extends BaseQueue<Item> {
    /**
     * 
     * @param isBefore Function that returns true if `a` should be yielded before `b`.
     * @param allowMultiple Whether an item can exist in the queue more than once. Default is `false`.
     * @param heapConstructor Constructor for creating a new heap. Default is a constructor that creates an `ArrayHeap` instance.
     */
    constructor(isBefore: (a:Item,b:Item)=>boolean,
                allowMultiple = false,
                heapConstructor: HeapConstructor<IHeap<any>> = ArrayHeap) {

        const isLess = (a:HeapNode<Item>,b:HeapNode<Item>) => isBefore(a.item, b.item)
        super(new heapConstructor(isLess), allowMultiple)
    }

    override push(item:Item): void {
        if (!(this.allowMultiple) && this.contains(item)) throw new Error('Item already exists in heap')
        const node = this.heap.createNode(item, -1)
        this.addItemNode(item, node)
        this.heap.insert(node)
    }

    override peek(): Item {
        const node = this.heap.peekMin()
        return node.item
    }

    override pop(): Item {
        const node = this.heap.extractMin()
        this.removeItemNode(node.item, node)
        return node.item
    }
}
