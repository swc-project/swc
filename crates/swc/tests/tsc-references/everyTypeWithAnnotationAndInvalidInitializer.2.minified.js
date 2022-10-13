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
    var _$F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A, M.F2 = _$F2;
}(M || (M = {})), function(N) {
    var _$F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    N.A = A, N.F2 = _$F2;
}(N || (N = {})), new D(), new D(), new C(), new C(), new N.A();
