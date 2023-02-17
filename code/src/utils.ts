

// sleep for specified amount of time
export const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Returns a random integer between 0 (inclusive) and max (exclusive)
 * @param max
 */
export function randInt(max:number): number

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 * @param min 
 * @param max 
 */
export function randInt(min:number, max:number): number

export function randInt(num1:number, num2?:number): number {
    let min, max
    if (num2 === undefined) {
        min = 0
        max = Math.floor(num1)
    } else {
        min = Math.ceil(num1)
        max = Math.floor(num2)
    }
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Returns true with given probability
 * @param prob Probability between 0 (inclusive) and 1 (inclusive)
 */
export function randTrue(prob:number): boolean {
    return Math.random() < prob
}

/**
 * Returns a random element of an array
 * @param array 
 */
export function getRandItem<T>(array:T[]): T {
    return array[randInt(array.length)]
}