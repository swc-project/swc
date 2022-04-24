import * as swcHelpers from "@swc/helpers";
var A, Point = function(x, y) {
    "use strict";
    swcHelpers.classCallCheck(this, Point), this.x = x, this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
}, Point || (Point = {}), function(A1) {
    var Point1 = function(x, y) {
        "use strict";
        swcHelpers.classCallCheck(this, Point1), this.x = x, this.y = y;
    };
    Point1.Origin = {
        x: 0,
        y: 0
    }, A1.Point = Point1, Point1 = A1.Point || (A1.Point = {});
}(A || (A = {}));
