import * as swcHelpers from "@swc/helpers";
// @filename: usage.js
import { default as Fooa } from "./cls";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @esModuleInterop: true
// @filename: cls.js
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
module.exports = Foo;
export var x = new Fooa();
export { default as Foob } from "./cls";
