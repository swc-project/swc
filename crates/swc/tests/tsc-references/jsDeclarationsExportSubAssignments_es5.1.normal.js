import * as swcHelpers from "@swc/helpers";
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
    swcHelpers.classCallCheck(this, Foo);
};
module.exports = Foo;
module.exports.Strings = Strings;
