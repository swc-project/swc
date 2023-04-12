//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
//// [/b.ts]
export { };
//// [/c.ts]
export * from "./b";
//// [/d.ts]
import { A, B } from "./c";
var _ = new A(); // Error
var __ = new B(); // Error
