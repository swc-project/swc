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
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
//// [/b.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
//// [/c.ts]
import { A, B, C } from "./b";
var _ = new A(); // Error
var __ = new B(); // Error
var ___ = new C(); // Ok
//// [/d.ts]
export { };
//// [/e.ts]
import { A, B, C } from "./d";
var _ = new A(); // Error
var __ = new B(); // Error
var ___ = new C(); // Error
