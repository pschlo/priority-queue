import { randInt } from "./utils"
import { ComparatorArrayQueue, ComparatorPointerQueue, KeyArrayQueue, KeyPointerQueue } from "./priorityQueue"



function randString(min:number=1, max:number=5) {
    const length = randInt(min, max)
    let result = '';
    //const chars = 'ABC'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i=0; i < length; i++)
      result += chars[randInt(0, chars.length)];
    return result;
}

function randPrio() {
    return randInt(-1000000, 1000000)
}


function isBefore(a:string, b:string) {
    return a.length < b.length
}







export default async function main() {
    const compArray = new ComparatorArrayQueue<string>(isBefore, true)
    const compPointer = new ComparatorPointerQueue<string>(isBefore, true)
    const keyArray = new KeyArrayQueue<string>()
    const keyPointer = new KeyPointerQueue<string>()

    for (let i=0; i<1000000; i++) {
        const str = randString(40)
        const prio = randPrio()
        compArray.push(str)
        compPointer.push(str)
    }
    console.log(compArray.size())
    console.log(compPointer.size())

    while (!(compArray.isEmpty())) {
        const arrayItem = compArray.pop()
        const pointerItem = compPointer.pop()
        if (!(arrayItem === pointerItem)) throw new Error('Not same!')
        console.log(arrayItem)
    }
    console.log(compArray.size())
    console.log(compPointer.size())
    // console.log(compPointer.itemToNodes.size)

}

