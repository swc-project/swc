//// [cls.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
//// [usage.js]
import { default as Fooa } from "./cls";
export var x = new Fooa();
export { default as Foob } from "./cls";
