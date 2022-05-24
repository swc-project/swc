import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @filename: usage.js
import { default as Fooa } from "./cls";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
export { Foo as default };
export var x = new Fooa();
export { default as Foob } from "./cls";
