//// [typeTagOnFunctionReferencesGeneric.js]
/**
 * @typedef {<T>(m : T) => T} IFn
 */ /**@type {IFn}*/ export function inJs(l) {
    return l;
}
inJs(1); // lints error. Why?
/**@type {IFn}*/ var inJsArrow = function(j) {
    return j;
};
inJsArrow(2); // no error gets linted as expected
