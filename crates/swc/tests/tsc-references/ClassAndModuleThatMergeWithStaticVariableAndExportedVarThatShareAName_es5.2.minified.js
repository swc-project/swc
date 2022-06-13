import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A, Point = function(x, y) {
    "use strict";
    _class_call_check(this, Point), this.x = x, this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
}, (Point || (Point = {})).Origin = "", function(A1) {
    var Point1 = function(x, y) {
        "use strict";
        _class_call_check(this, Point1), this.x = x, this.y = y;
    };
    Point1.Origin = {
        x: 0,
        y: 0
    }, A1.Point = Point1, (Point1 = A1.Point || (A1.Point = {})).Origin = "";
}(A || (A = {}));
