//// [a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
//// [b.ts]
import * as _a from "./a";
export { _a as a };
//// [c.ts]
export { };
//// [d.ts]
import { a } from "./c";
new a.A();
