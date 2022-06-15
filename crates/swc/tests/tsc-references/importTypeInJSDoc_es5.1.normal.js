module.exports = MyClass;
// @filename: index.js
/**
 * @typedef {import("./externs")} Foo
 */ var a = /** @type {Foo} */ (/** @type {*} */ (undefined));
a = new Foo({
    doer: Foo.Bar
});
var q = /** @type {import("./externs").Bar} */ ({
    doer: function(q) {
        return q;
    }
});
var r = /** @type {typeof import("./externs").Bar} */ function(r) {
    return r;
};
// @target: es6
// @outDir: ./out
// @allowJs: true
// @checkJs: true
// @filename: externs.d.ts
export { };
