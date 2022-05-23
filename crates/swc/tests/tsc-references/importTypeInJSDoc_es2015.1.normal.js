module.exports = MyClass;
// @filename: index.js
/**
 * @typedef {import("./externs")} Foo
 */ let a = /** @type {Foo} */ (/** @type {*} */ (undefined));
a = new Foo({
    doer: Foo.Bar
});
const q = /** @type {import("./externs").Bar} */ ({
    doer: (q1)=>q1
});
const r = /** @type {typeof import("./externs").Bar} */ ((r1)=>r1);
// @target: es6
// @outDir: ./out
// @allowJs: true
// @checkJs: true
// @filename: externs.d.ts
export { };
