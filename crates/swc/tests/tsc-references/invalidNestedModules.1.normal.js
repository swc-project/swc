//// [invalidNestedModules.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    (function(B) {
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
        };
        B.C = C;
    })(A.B || (A.B = {}));
})(A || (A = {}));
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
    (function(X) {})(M2.X || (M2.X = {}));
})(M2 || (M2 = {}));
var A, M2;
