//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { A as default };
//// [/b.ts]
new A();
var a = {
    a: ''
};
var b = {
    A: A
};
export { };
