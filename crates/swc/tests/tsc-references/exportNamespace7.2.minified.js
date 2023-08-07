//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
export var B = function B() {
    _class_call_check(this, B);
};
export var C = function C() {
    _class_call_check(this, C);
};
//// [/b.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var C = function C() {
    _class_call_check(this, C);
};
//// [/c.ts]
import { A, B, C } from "./b";
new A(), new B(), new C();
//// [/d.ts]
export { };
//// [/e.ts]
import { A, B, C } from "./d";
new A(), new B(), new C();
