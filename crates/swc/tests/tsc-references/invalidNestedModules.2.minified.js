//// [invalidNestedModules.ts]
var A, M2;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var B;
    ((B = A.B || (A.B = {})).C || (B.C = {})).Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
}(A || (A = {})), function(A) {
    (A.B || (A.B = {})).C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
}(A || (A = {})), function(M2) {
    (M2.X || (M2.X = {})).Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
}(M2 || (M2 = {})), function(M2) {
    var Point;
    (M2.X || (M2.X = {})).Point = Point;
}(M2 || (M2 = {}));
