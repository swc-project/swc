// @filename: index.js
/**
 * @typedef {import("./externs")} Foo
 */ let a = /** @type {Foo} */ (/** @type {*} */ (undefined));
a = new Foo({
    doer: Foo.Bar
});
const q = /** @type {import("./externs").Bar} */ ({
    doer: (q)=>q
});
const r = /** @type {typeof import("./externs").Bar} */ ((r)=>r);
module.exports = MyClass;
// @target: es6
// @outDir: ./out
// @allowJs: true
// @checkJs: true
// @filename: externs.d.ts
export { };
