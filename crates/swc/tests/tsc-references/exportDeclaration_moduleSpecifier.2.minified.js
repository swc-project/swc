//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
//// [/b.ts]
export { };
//// [/c.ts]
import { A } from './b';
new A();
