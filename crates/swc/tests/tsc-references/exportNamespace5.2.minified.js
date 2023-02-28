//// [exportNamespace5.ts]
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
export var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
//// [/b.ts]
export { X } from "./a";
//// [/c.ts]
import { A, B as C, X } from "./b";
new A(), new C(), new X();
//// [/d.ts]
export * from "./a";
//// [/e.ts]
import { A, B, X } from "./d";
new A(), new B(), new X();
