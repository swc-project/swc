//// [invalidNestedModules.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    (function(B) {
        (function(C) {
            var Point = function Point() {
                "use strict";
                _class_call_check(this, Point);
            };
            C.Point = Point;
        })(B.C || (B.C = {}));
    })(A.B || (A.B = {}));
})(A || (A = {}));
(function(A) {
    var B;
    (function(B) {
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
        };
        B.C = C;
    })(B = A.B || (A.B = {}));
})(A || (A = {}));
var M2;
(function(M2) {
    (function(X) {
        var Point = function Point() {
            "use strict";
            _class_call_check(this, Point);
        };
        X.Point = Point;
    })(M2.X || (M2.X = {}));
})(M2 || (M2 = {}));
(function(M2) {
    var X;
    (function(X) {})(X = M2.X || (M2.X = {}));
})(M2 || (M2 = {}));
