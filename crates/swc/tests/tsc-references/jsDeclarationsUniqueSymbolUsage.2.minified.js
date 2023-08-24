//// [a.js]
export var kSymbol = Symbol("my-symbol"); /**
 * @typedef {{[kSymbol]: true}} WithSymbol
 */ 
//// [b.js]
/**
 * @returns {import('./a').WithSymbol} 
 * @param {import('./a').WithSymbol} value 
 */ export function b(value) {
    return value;
}
