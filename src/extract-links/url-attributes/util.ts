// Some simple helpers inspired by lodash/fp.

/**
 * Merge two objects, with a custom function for resolving conflicts.
 * @param {(any, any) => any} mergeValues - Function to resolve the conflict whenever two objects
 * both have a value for some key. The returned value will be the one used in the resulting object.
 * @param {...Object} object - Objects that will be shallowly merged, starting with the leftmost one
 * @returns {Object} A new object, with values of the given objects merged in to it.
 */
export function mergeWith<T, U extends object>(mergeValues: (a: T, b: T) => T): (...objects: U[]) => U {
    return (...objects) => {
        const result: { [key: string]: any } = {}
        for (const object of objects) {
            for (const [key, value] of Object.entries(object)) {
                result[key] = key in result ? mergeValues(result[key], value) : value
            }
        }
        return result as U
    }
}

/**
 * Return a clone of the object with given keys omitted.
 * @param {string[]} keys - The keys to omit when copying the object
 * @=>
 * @param {Object} object
 * @returns {Object} A shallow copy of object without the listed keys
 */
export function omit<T extends object>(keys: string[]): (object: T) => Partial<T> {
    return object => {
        const entries = Object.entries(object) as [string & keyof T, any][]
        const result: Partial<T> = {}
        for (const [key, value] of entries) {
            if (!keys.includes(key)) {
                result[key] = value
            }
        }
        return result
    }
}

/**
 * Return a clone of the array, with duplicate values removed.
 * @param {Array} - array
 * @returns {Array} newArray - copy of the array without duplicates
 */
export const uniq: <T>(array: Array<T>) => Array<T> = array => {
    const newArray = []
    const seen = new Set()
    for (const value of array) {
        if (!(seen.has(value))) {
            seen.add(value)
            newArray.push(value)
        }
    }
    return newArray
}
