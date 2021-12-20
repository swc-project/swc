// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: tests/cases/conformance/jsdoc/declarations/out
// @declaration: true
// @filename: something.ts
export var o = {
    a: 1,
    m: 1
};
// @filename: index.js
var _o = require("./something").o, a = _o.a, m = _o.m;
var thing = a + m;
module.exports = {
    thing: thing
};
