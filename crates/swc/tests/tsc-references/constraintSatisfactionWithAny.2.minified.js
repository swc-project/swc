//// [constraintSatisfactionWithAny.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {
    return null;
}
function foo2(x) {
    return null;
}
function foo4(x) {
    return null;
}
foo(a), foo2(a), foo4(a), foo(b), foo2(b), foo4(b);
var a, b, C = function C(x) {
    "use strict";
    _class_call_check(this, C), this.x = x;
}, c1 = new C(a), c2 = new C(b), C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2), this.x = x;
}, c3 = new C2(a), c4 = new C2(b), C4 = function C4(x) {
    "use strict";
    _class_call_check(this, C4), this.x = x;
}, c7 = new C4(a), c8 = new C4(b);
