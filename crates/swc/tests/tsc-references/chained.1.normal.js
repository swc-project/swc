//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { };
//// [/b.ts]
export { B as C } from './a';
//// [/c.ts]
export { };
//// [/d.ts]
import { D } from './c';
new D();
var d = {};
