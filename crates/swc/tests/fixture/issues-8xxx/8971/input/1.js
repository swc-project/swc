export function f() {
    return [
        typeof a === 'object', /* if a is a polyfilled symbol the result is wrong */
        typeof b === 'symbol',
        typeof c
    ]
}