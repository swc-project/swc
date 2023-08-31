//// [typeTagOnFunctionReferencesGeneric.js]
/**
 * @typedef {<T>(m : T) => T} IFn
 */ /**@type {IFn}*/ export function inJs(l) {
    return l;
}
inJs(1); // lints error. Why?
 // no error gets linted as expected
