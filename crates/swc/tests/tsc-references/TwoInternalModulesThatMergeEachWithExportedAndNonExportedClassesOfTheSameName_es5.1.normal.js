import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A;
(function(A1) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    A1.Point = Point;
})(A || (A = {}));
(function(A) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point() {
            _class_call_check(this, Point);
        }
        var _proto = Point.prototype;
        _proto.fromCarthesian = function fromCarthesian(p1) {
            return {
                x: p1.x,
                y: p1.y
            };
        };
        return Point;
    }();
})(A || (A = {}));
// ensure merges as expected
var p;
var p;
var X;
(function(X1) {
    var Y1;
    (function(Y) {
        var Z1;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            Z.Line = Line;
        })(Z1 = Y.Z || (Y.Z = {}));
    })(Y1 = X1.Y || (X1.Y = {}));
})(X || (X = {}));
(function(X2) {
    var Y2;
    (function(Y) {
        var Z;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
        })(Z = Y.Z || (Y.Z = {}));
    })(Y2 = X2.Y || (X2.Y = {}));
})(X || (X = {}));
// ensure merges as expected
var l;
var l;
