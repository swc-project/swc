import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
module.exports = Foo;
import { default as Fooa } from "./cls";
export var x = new Fooa();
export { default as Foob } from "./cls";
