//// [typeTagNoErasure.js]
/** @template T @typedef {<T1 extends T>(data: T1) => T1} Test */ /** @type {Test<number>} */ var test = function(dibbity) {
    return dibbity;
};
test(1) // ok, T=1
;
test('hi') // error, T=number
;
