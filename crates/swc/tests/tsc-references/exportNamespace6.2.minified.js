//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
export var B = function B() {
    _class_call_check(this, B);
};
//// [/b.ts]
export { };
//// [/c.ts]
export * from "./b";
//// [/d.ts]
import { A, B } from "./c";
new A(), new B();
