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







async function main() {
    const compArray = new ComparatorArrayQueue<string>(isBefore)
    const compPointer = new ComparatorPointerQueue<string>(isBefore)
    const keyArray = new KeyArrayQueue<string>()
    const keyPointer = new KeyPointerQueue<string>()
}


main()


