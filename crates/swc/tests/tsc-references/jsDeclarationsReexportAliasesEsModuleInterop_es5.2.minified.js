import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import { default as Fooa } from "./cls";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
};
module.exports = Foo;
export var x = new Fooa();
export { default as Foob } from "./cls";
