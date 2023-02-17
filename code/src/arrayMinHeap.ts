import { EmptyHeapError, Heap, HeapNode, InvalidNodeError } from "./heap"



export class ArrayNode<T> implements HeapNode<T> {
    readonly item: T
    key: number

    heap: ArrayHeap<any> | null = null
    index: number | null = null

    constructor(item:T, key:number) {
        this.item = item,
        this.key = key
    }

    parent() {
        return this.heap!.getNodeAt(Math.floor((this.index! - 1) / 2))
    }

    leftChild() {
        return this.heap!.getNodeAt(2 * this.index! + 1)
    }

    rightChild() {
        return this.heap!.getNodeAt(2 * this.index! + 2)
    }

    in(heap:ArrayHeap<any>): boolean {
        return this.heap === heap
    }


    // does not check if node is in heap or if parent exists
    private swapWithParent(): void {
        const parent = this.parent()!

        // modify array
        this.heap!.setNodeAt(this.index!, parent)
        this.heap!.setNodeAt(parent.index!, this)

        // set stored indices
        const tmp = this.index
        this.index = parent.index
        parent.index = tmp
    }

    bubbleUp() {
        const isLess = this.heap!.isLess

        let parent = this.parent()
        while (parent != null && isLess(this, parent)) {
            this.swapWithParent()
            parent = this.parent()
        }
    }

    bubbleDown() {
        const isLess = this.heap!.isLess

        while (true) {
            const leftChild = this.leftChild()
            const rightChild = this.rightChild()

            let min: ArrayNode<T> = this
            if (leftChild != null && isLess(leftChild, min))
                min = leftChild
            if (rightChild != null && isLess(rightChild, min))
                min = rightChild

            if (min !== this)
                min.swapWithParent()
            else
                return
        }
    }

}











// Heap that acts on an arbitrary but fixed type of BaseArrayNode

/**
 * Implementation of min heap using array.
 * 
 * The heap keeps track of each item's indices and provides this information via `getIndices`.
 * Internally, it does not use this information and only deals with nodes and indices rather than items.
 * 
 * Since an ArrayHeapNode only serves as a container and does not have any pointers,
 * the same node may be inserted multiple times.
 * 
 */
export class ArrayHeap<T> implements Heap<ArrayNode<T>> {
    private readonly array: ArrayNode<T>[] = []
    isLess: (a: ArrayNode<T>, b: ArrayNode<T>) => boolean

    constructor(isLess?: (a: ArrayNode<T>, b: ArrayNode<T>) => boolean) {
        if (isLess == null)
            this.isLess = (a, b) => a.key < b.key
        else
            this.isLess = isLess
    }


    size(): number {
        // must be equal to this.array.length
        return this.array.length
    }

    isEmpty(): boolean {
        return this.size() === 0
    }

    insert(node:ArrayNode<T>): void {
        if (node.heap != null) throw new InvalidNodeError('Node is already bound to a heap')

        // initialize node
        node.heap = this
        node.index = this.array.length

        // insert after last node
        this.array.push(node)

        // fix
        node.bubbleUp()

        return
    }

    remove(node:ArrayNode<T>) {
        if (!(node.in(this))) throw new InvalidNodeError('Node does not exist in heap')
        const nodeIndex = node.index!

        // clear heap reference
        node.heap = null

        // get last node
        const lastNode = this.getNodeAt(this.array.length-1)!

        // remove last node
        this.array.pop()

        // replace to be deleted node with last node
        if (node === lastNode)
            // nothing to do
            return node
        this.setNodeAt(nodeIndex, lastNode)
        lastNode.index = nodeIndex

        // bubble
        lastNode.bubbleUp()
        lastNode.bubbleDown()

        return node
    }

    peekMin(): ArrayNode<T> {
        if (this.isEmpty()) throw new EmptyHeapError('Cannot peek on empty heap')
        return this.getNodeAt(0)!
    }

    extractMin(): ArrayNode<T> {
        if (this.isEmpty()) throw new EmptyHeapError('Cannot extract from empty heap')
        return this.remove(this.getNodeAt(0)!)
    }

    /**
     * Returns node at the given index in the internal array
     * @param index 
     */
    getNodeAt(index:number): ArrayNode<T> | null {
        const node = this.array[index]
        if (node == null)
            return null
        return node
    }

    /**
     * Sets node at the given index in the internal array to the given node
     * @param index
     */
    setNodeAt(index:number, node:ArrayNode<T>): void {
        this.array[index] = node
    }

    updateKey(node:ArrayNode<T>, key:number): void {
        if (!(node.in(this))) throw new InvalidNodeError('Node does not exist in heap')

        const oldKey = node.key
        if (key === oldKey)
            return
        node.key = key
        if (key < oldKey)
            node.bubbleUp()
        else
            node.bubbleDown()
    }
}
