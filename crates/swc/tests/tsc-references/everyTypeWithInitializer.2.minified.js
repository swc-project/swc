//// [everyTypeWithInitializer.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
!function(M) {
    var F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A, M.F2 = F2;
}(M || (M = {})), new C(), new C(), new D(), new M.A(), M.F2;
