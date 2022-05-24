import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
    _class_call_check(this, Foo);
};
module.exports = Foo;
export var x = new Fooa();
export { default as Foob } from "./cls";
