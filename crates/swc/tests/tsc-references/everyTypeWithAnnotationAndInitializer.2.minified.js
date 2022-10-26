//// [everyTypeWithAnnotationAndInitializer.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
!function(M) {
    M.A = function A() {
        "use strict";
        _class_call_check(this, A);
    }, M.F2 = function(x) {
        return x.toString();
    };
}(M || (M = {})), new C(), new C(), new function D() {
    "use strict";
    _class_call_check(this, D);
}(), new C(), new M.A();
