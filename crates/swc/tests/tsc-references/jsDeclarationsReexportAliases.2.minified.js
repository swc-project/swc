//// [cls.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
export { Foo as default };
//// [usage.js]
import { default as Fooa } from "./cls";
export var x = new Fooa();
export { default as Foob } from "./cls";
