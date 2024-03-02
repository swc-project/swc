//// [exportNamespace5.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
export var B = function B() {
    _class_call_check(this, B);
};
export var X = function X() {
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
