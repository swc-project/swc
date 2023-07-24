//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    _class_call_check(this, A);
};
export { A as default };
//// [/b.ts]
new A(), A;
export { };
