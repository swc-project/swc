//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
export var B = function B() {
    _class_call_check(this, B);
};
//// [/b.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var B = function B() {
    _class_call_check(this, B);
};
export var C = function C() {
    _class_call_check(this, C);
};
//// [/c.ts]
export * from "./b";
//// [/d.ts]
import { A, B, C } from "./c";
new A(), new B(), new C();
