//// [a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
//// [b.ts]
export { };
//// [c.ts]
import * as _a from './b';
export { _a as a };
//// [d.ts]
import { a } from './c';
new a.A();
