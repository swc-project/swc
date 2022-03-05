var A, X;
import * as swcHelpers from "@swc/helpers";
!function(A1) {
    var Point = function() {
        "use strict";
        swcHelpers.classCallCheck(this, Point);
    };
    A1.Point = Point;
}(A || (A = {})), (function(A) {
    var Point = function() {
        "use strict";
        function Point() {
            swcHelpers.classCallCheck(this, Point);
        }
        return swcHelpers.createClass(Point, [
            {
                key: "fromCarthesian",
                value: function(p) {
                    return {
                        x: p.x,
                        y: p.y
                    };
                }
            }
        ]), Point;
    }();
})(A || (A = {})), (function(X1) {
    var Y, Z, Line;
    Z = (Y = X1.Y || (X1.Y = {})).Z || (Y.Z = {}), Line = function() {
        "use strict";
        swcHelpers.classCallCheck(this, Line);
    }, Z.Line = Line;
})(X || (X = {})), (function(X2) {
    var Y, Line;
    (Y = X2.Y || (X2.Y = {})).Z || (Y.Z = {}), Line = function() {
        "use strict";
        swcHelpers.classCallCheck(this, Line);
    };
})(X || (X = {}));
