//// [constraintSatisfactionWithEmptyObject.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {}
function foo2(x) {}
foo({}), foo({}), new function C(x) {
    "use strict";
    _class_call_check(this, C), this.x = x;
}({}), foo2({}), foo2({}), new function C2(x) {
    "use strict";
    _class_call_check(this, C2), this.x = x;
}({});
