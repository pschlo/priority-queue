import { EmptyHeapError, Heap, HeapError, HeapNode, InvalidNodeError } from "./heap"


export class PointerNode<T> implements HeapNode<T> {
    readonly item: T
    key: number

    heap: PointerMinHeap<T> | null = null
    parent: PointerNode<T> | null = null
    left: PointerNode<T> | null = null
    right: PointerNode<T> | null = null

    constructor(item:T, key:number) {
        this.item = item
        this.key = key
    }

    in(heap:PointerMinHeap<T>): boolean {
        return this.heap === heap
    }

    /**
     * Swaps a node with its parent.
     * Does not check if node is in heap or if parent exists.
     *
     * Example: Let B be the given node.
     * If A is left child of X and B is left child of A, the transformation looks as follows:
     *
     *            X                   X
     *           /                   /
     *          A        ---->      B
     *         / \                 / \
     *        B   B_              A   B_
     *       / \                 / \
     *      YL  YR              YL  YR
     *
     * @param node
     */
    private swapWithParent(): void {
        const A = this.parent!
        const B = this
        const B_ = (B === A.left ? A.right : A.left)  // sibling of B
        const X = A.parent
        const YL = B.left
        const YR = B.right

        // fix child ref of X
        if (X == null)
            // parent of A is null, i.e. A is the root
            // fix root reference
            this.heap!.root = B
        else if (A === X.left)
            X.left = B
        else
            X.right = B

        // fix parent ref of A, B and B_
        B.parent = X
        if (B_ != null) B_.parent = B
        A.parent = B
        
        // fix child refs of B
        if (B === A.left) {
            B.left = A
            B.right = B_
        } else {
            B.left = B_
            B.right = A
        }

        // fix child refs of A
        A.left = YL
        A.right = YR

        // fix parent refs of YL and YR
        if (YL != null) YL.parent = A
        if (YR != null) YR.parent = A
    }


    bubbleUp(): void {
        const isLess = this.heap!.isLess
        while (this.parent != null && isLess(this, this.parent))
            this.swapWithParent()
    }

    bubbleDown(): void {
        const isLess = this.heap!.isLess

        while (true) {
            let min: PointerNode<T> = this
            if (this.left != null && isLess(this.left, min))
                min = this.left
            if (this.right != null && isLess(this.right, min))
                min = this.right

            if (min !== this)
                min.swapWithParent()
            else
                return
        }
    }
}






/**
 * Since a PointerHeapNode has pointers, the same node may not be inserted more than once.
 */
export class PointerMinHeap<T> implements Heap<PointerNode<T>> {
    root: PointerNode<T> | null = null
    isLess: (a: PointerNode<T>, b: PointerNode<T>) => boolean
    private _size: number = 0

    constructor(isLess?: (a: PointerNode<T>, b: PointerNode<T>) => boolean) {
        if (isLess == null)
            this.isLess = (a, b) => a.key < b.key
        else
            this.isLess = isLess
    }

    size(): number {
        return this._size
    }

    isEmpty(): boolean {
        return this.size() === 0
    }


    /**
     * Follows the given path, starting from the root node.
     * The path is read from left to right.
     * A 0 stands for descending to the left child and a 1 for the right child.
     * Invalid paths will raise an error.
     * 
     * Ex: if the path is `001`, the returned node is the node that is reached when going twice to the left and once to the right.
     * @param path string of 0s and 1s
     * @returns node at the end of the path
     */
    private pathToNode(path: string): PointerNode<T> {
        let node = this.root
        for (let char of path) {
            node = char === '0' ? node!.left : node!.right
        }
        if (node == null) throw new HeapError('Invalid path')
        return node
    }
    

    insert(node:PointerNode<T>): PointerNode<T> {
        if (node.heap != null) throw new InvalidNodeError('Node is already bound to a heap')

        // initialize node
        node.heap = this
        node.left = null
        node.right = null

        //## insert after last node
        this._size++
        if (this.root === null) {
            // heap is empty
            node.parent = null
            this.root = node
            return node
        }
        // get future parent of the new node
        const parentPath = this.size().toString(2).slice(1, -1)
        const parent = this.pathToNode(parentPath)

        // link new node to parent
        node.parent = parent
        if (parent.left == null)
            parent.left = node
        else
            parent.right = node

        // fix
        node.bubbleUp()

        return node
    }

    remove(node: PointerNode<T>): PointerNode<T> {
        if (!(node.in(this))) throw new InvalidNodeError('Node does not exist in heap')

        // clear heap reference
        node.heap = null

        // get last node
        const lastNodePath = (this.size()).toString(2).slice(1)
        const lastNode = this.pathToNode(lastNodePath)
        
        //## unlink last node
        this._size--
        if (lastNode.parent == null)
            // only the root has a parent of null
            // The heap thus has size 1 and the node to delete is the root
            this.root = null
        else if (lastNode === lastNode.parent.left)
            lastNode.parent.left = null
        else
            lastNode.parent.right = null
            
        //## replace to be deleted node with last node

        if (node === lastNode)
            // nothing to to
            return node

        // fix parent
        if (node.parent == null)
            this.root = lastNode
        else if (node === node.parent.left)
            node.parent.left = lastNode
        else
            node.parent.right = lastNode

        // fix children
        if (node.left != null) node.left.parent = lastNode
        if (node.right != null) node.right.parent = lastNode

        // fix lastNode
        lastNode.parent = node.parent
        lastNode.left = node.left
        lastNode.right = node.right

        //## bubble
        lastNode.bubbleUp()
        lastNode.bubbleDown()

        return node
    }

    updateKey(node:PointerNode<T>, key:number): void {
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


    peekMin(): PointerNode<T> {
        if (this.root == null) throw new EmptyHeapError('Cannot peek on empty heap')
        return this.root
    }

    extractMin(): PointerNode<T> {
        // console.log(this.itemToNodes)
        if (this.root == null) throw new EmptyHeapError('Cannot extract from empty heap')
        return this.remove(this.root)
    }
}


