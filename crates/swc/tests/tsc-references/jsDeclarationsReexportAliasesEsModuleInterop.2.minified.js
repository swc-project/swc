//// [cls.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = function Foo() {
    _class_call_check(this, Foo);
};
//// [usage.js]
import { default as Fooa } from "./cls";
export var x = new Fooa();
export { default as Foob } from "./cls";
