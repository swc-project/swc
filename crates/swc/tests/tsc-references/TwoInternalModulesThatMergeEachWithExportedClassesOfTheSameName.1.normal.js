//// [TwoInternalModulesThatMergeEachWithExportedClassesOfTheSameName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    A.Point = Point;
})(A || (A = {}));
(function(A) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    // expected error
    A.Point = Point;
})(A || (A = {}));
var X;
(function(X) {
    (function(Y) {
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            Z.Line = Line;
        })(Y.Z || (Y.Z = {}));
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
(function(X) {
    var Y;
    (function(Y) {
        var Z;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            // expected error
            Z.Line = Line;
        })(Z = Y.Z || (Y.Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
