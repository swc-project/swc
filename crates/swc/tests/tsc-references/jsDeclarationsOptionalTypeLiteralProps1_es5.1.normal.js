// @allowJs: true
// @checkJs: true
// @target: esnext
// @outDir: ./out
// @declaration: true
// @filename: foo.js
/**
 * foo
 *
 * @public
 * @param {object} opts
 * @param {number} opts.a
 * @param {number} [opts.b]
 * @param {number} [opts.c]
 * @returns {number}
 */ function foo(param) {
    var a = param.a, b = param.b, c = param.c;
    return a + b + c;
}
