// import { UniquePriorityQueue, MultiPriorityQueue } from "./pointerPriorityQueue"



// class SortedList<T> {
//     private data: SimpleNode<T>[] = []
//     private itemToIndices: Map<T,Set<number>> = new Map()

//     size() {
//         return this.data.length
//     }

//     isEmpty() {
//         return this.size() === 0
//     }

//     private addIndex(item:T, index:number) {
//         let indices = this.itemToIndices.get(item)
//         if (indices == null) {
//             indices = new Set()
//             this.itemToIndices.set(item, indices)
//         }
//         indices.add(index)
//     }

//     private removeIndex(item:T, index:number) {
//         let indices = this.itemToIndices.get(item)
//         if (indices == null) throw new Error('Item not in heap')
//         if (!(indices.has(index))) throw new Error('Index not in item indices')
//         indices.delete(index)
//         if (indices.size === 0)
//             this.itemToIndices.delete(item)
//     }

//     private replaceIndex(item:T, oldIndex:number, newIndex: number) {
//         this.removeIndex(item, oldIndex)
//         this.addIndex(item, newIndex)
//     }

//     extractMin() {
//         if (this.isEmpty()) throw new Error('')
//         const node = this.data[this.data.length-1].item
//         tj
//         return new SortedListNode(minNode.item, minNode.key)
//     }

//     push(item: T, priority:number) {
//         let i
//         for (i=this.data.length; i >= 0; i--) {
//             if (this.data[i-1].key < priority) {
//                 this.data.splice(i, 0, new SimpleNode(item, priority))
//                 this.addIndex(item, i)
//                 break
//             }
//         }
//         throw new Error('')
//     }

//     peek() {
//         if (this.isEmpty()) throw new Error('')
//         const node = this.data[this.getMinIndex()]
//         return new PriorityQueueItem(node.item, node.key)
//     }

//     update(item:T, priority:number) {
//         this.data
//     }

//     delete(item:T) {
//         const indices = this.itemToIndices.get(item)
//         if (indices == null) throw new Error('Item does not exist in queue')
//         const [index] = indices
//         this.data.splice(index, 0, )
//         this.removeIndex(item, index)
//     }
// }








// class SortedListNode<T> {
//     item: T
//     key: number

//     constructor(item:T, key:number) {
//         this.item = item
//         this.key = key
//     }
// }


// export class SimplePriorityQueue<T> implements UniquePriorityQueue<T> {
//     private list: SortedList<T> = new SortedList()

//     size() {
//         return this.list.size()
//     }

//     isEmpty() {
//         return this.size() === 0
//     }

    




// }