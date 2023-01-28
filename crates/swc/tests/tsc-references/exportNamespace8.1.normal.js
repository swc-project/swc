//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
//// [/b.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
//// [/c.ts]
export * from "./b"; // Collision error
//// [/d.ts]
import { A, B, C } from "./c";
var _ = new A(); // Error
var __ = new B(); // Ok
var ___ = new C(); // Ok
