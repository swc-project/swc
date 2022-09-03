//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
//// [/b.ts]
import { A } from "./a";
new A();
