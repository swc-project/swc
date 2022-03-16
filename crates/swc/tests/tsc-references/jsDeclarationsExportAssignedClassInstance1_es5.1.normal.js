import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
module.exports = new Foo();
