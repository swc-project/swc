var A, X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var Point = function() {
        "use strict";
        _class_call_check(this, Point);
    };
    A.Point = Point;
}(A || (A = {})), function(A) {
    var Point = function() {
        "use strict";
        function Point() {
            _class_call_check(this, Point);
        }
        return Point.prototype.fromCarthesian = function(p) {
            return {
                x: p.x,
                y: p.y
            };
        }, Point;
    }();
}(A || (A = {})), function(X) {
    var Y, Z, Line;
    Z = (Y = X.Y || (X.Y = {})).Z || (Y.Z = {}), Line = function() {
        "use strict";
        _class_call_check(this, Line);
    }, Z.Line = Line;
}(X || (X = {})), function(X) {
    var Y, Line;
    (Y = X.Y || (X.Y = {})).Z || (Y.Z = {}), Line = function() {
        "use strict";
        _class_call_check(this, Line);
    };
}(X || (X = {}));
