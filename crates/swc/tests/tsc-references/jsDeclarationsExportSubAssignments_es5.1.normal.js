import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: cls.js
var Strings = {
    a: "A",
    b: "B"
};
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
module.exports = Foo;
module.exports.Strings = Strings;
