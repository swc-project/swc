import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
};
export { Foo as default };
import { default as Fooa } from "./cls";
export var x = new Fooa();
export { default as Foob } from "./cls";
