//// [everyTypeWithAnnotationAndInvalidInitializer.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M, N, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
!function(M) {
    M.A = function A() {
        "use strict";
        _class_call_check(this, A);
    }, M.F2 = function(x) {
        return x.toString();
    };
}(M || (M = {})), function(N) {
    N.A = function A() {
        "use strict";
        _class_call_check(this, A);
    }, N.F2 = function(x) {
        return x.toString();
    };
}(N || (N = {})), new D(), new D(), new C(), new C(), new N.A();
