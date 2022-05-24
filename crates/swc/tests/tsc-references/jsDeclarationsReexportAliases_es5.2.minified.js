import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import { default as Fooa } from "./cls";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
};
export var x = new Fooa();
export { default as Foob } from "./cls";
export { Foo as default };
