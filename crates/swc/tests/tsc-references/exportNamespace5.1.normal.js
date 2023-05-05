//// [exportNamespace5.ts]
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
export var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
//// [/b.ts]
export { X } from "./a";
//// [/c.ts]
import { A, B as C, X } from "./b";
var _ = new A(); // Error
var __ = new C(); // Error
var ___ = new X(); // Ok
//// [/d.ts]
export * from "./a";
//// [/e.ts]
import { A, B, X } from "./d";
var _ = new A(); // Ok
var __ = new B(); // Ok
var ___ = new X(); // Ok
