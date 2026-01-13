//// [externs.d.ts]
export { };
//// [index.js]
/**
 * @typedef {import("./externs")} Foo
 */ let a = /** @type {*} */ undefined;
a = new Foo({
    doer: Foo.Bar
});
const q = /** @type {import("./externs").Bar} */ {
    doer: (q)=>q
};
const r = /** @type {typeof import("./externs").Bar} */ (r)=>r;
