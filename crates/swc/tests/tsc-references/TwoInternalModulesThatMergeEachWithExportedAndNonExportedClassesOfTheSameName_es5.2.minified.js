var A, X;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function(A1) {
    var Point = function() {
        "use strict";
        _class_call_check(this, Point);
    };
    A1.Point = Point;
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
}(A || (A = {})), function(X1) {
    var Y, Z, Line;
    Z = (Y = X1.Y || (X1.Y = {})).Z || (Y.Z = {}), Line = function() {
        "use strict";
        _class_call_check(this, Line);
    }, Z.Line = Line;
}(X || (X = {})), function(X2) {
    var Y, Line;
    (Y = X2.Y || (X2.Y = {})).Z || (Y.Z = {}), Line = function() {
        "use strict";
        _class_call_check(this, Line);
    };
}(X || (X = {}));
