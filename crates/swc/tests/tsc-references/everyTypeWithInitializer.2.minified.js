//// [everyTypeWithInitializer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
}(), new M.A(), M.F2;
