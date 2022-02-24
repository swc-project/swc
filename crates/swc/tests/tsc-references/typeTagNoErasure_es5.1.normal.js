// @checkJs:true
// @declaration: true
// @outdir: out/
// @filename: typeTagNoErasure.js
/** @type {Test<number>} */ /** @template T @typedef {<T1 extends T>(data: T1) => T1} Test */ /** @type {Test<number>} */ var test = function(dibbity) {
    return dibbity;
};
test(1) // ok, T=1
;
test('hi') // error, T=number
;
