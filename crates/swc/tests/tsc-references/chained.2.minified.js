//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
//// [/b.ts]
export { B as C } from "./a";
//// [/c.ts]
export { };
//// [/d.ts]
import { D } from "./c";
new D();
var d = {};
