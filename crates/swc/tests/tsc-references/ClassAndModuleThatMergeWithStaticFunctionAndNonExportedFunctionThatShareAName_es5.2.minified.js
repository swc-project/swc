import * as swcHelpers from "@swc/helpers";
var A, Point = function() {
    function Point(x, y) {
        swcHelpers.classCallCheck(this, Point), this.x = x, this.y = y;
    }
    return Point.Origin = function() {
        return {
            x: 0,
            y: 0
        };
    }, Point;
}();
!function(A1) {
    var Point = function() {
        function Point(x, y) {
            swcHelpers.classCallCheck(this, Point), this.x = x, this.y = y;
        }
        return Point.Origin = function() {
            return {
                x: 0,
                y: 0
            };
        }, Point;
    }();
    A1.Point = Point;
}(A || (A = {}));
