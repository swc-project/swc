//// [callSignatureWithoutReturnTypeAnnotationInference.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function m1() {
    return 1;
}
!function foo3() {
    return foo3();
}(), function(x) {
    void 0 === x || _type_of(x);
}(1), function(M) {
    M.x = 1, M.C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
}(M || (M = {})), (m1 || (m1 = {})).y = 2;
var M, e1, c1 = function c1(x) {
    "use strict";
    _class_call_check(this, c1);
};
(c1 || (c1 = {})).x = 1, function(e1) {
    e1[e1.A = 0] = "A";
}(e1 || (e1 = {})), (e1 || (e1 = {})).y = 1;
