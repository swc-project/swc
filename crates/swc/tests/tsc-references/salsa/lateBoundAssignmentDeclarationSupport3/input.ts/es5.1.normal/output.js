// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport3.js
// currently unsupported
var _sym = Symbol();
var _str = "my-fake-sym";
Object.defineProperty(module.exports, _sym, {
    value: "ok"
});
Object.defineProperty(module.exports, _str, {
    value: "ok"
});
module.exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport3.js");
var y = x["my-fake-sym"];
var z = x[x.S];
