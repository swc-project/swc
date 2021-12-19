module.exports = MyClass;
// @filename: index.js
/**
 * @typedef {import("./externs")} Foo
 */ var a = /** @type {Foo} */ (/** @type {*} */ (undefined));
a = new Foo({
    doer: Foo.Bar
});
var q = /** @type {import("./externs").Bar} */ ({
    doer: function(q1) {
        return q1;
    }
});
var r = /** @type {typeof import("./externs").Bar} */ function(r1) {
    return r1;
};
// @target: es6
// @outDir: ./out
// @allowJs: true
// @checkJs: true
// @filename: externs.d.ts
export { };
