import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A, Point = function(x, y) {
    "use strict";
    _class_call_check(this, Point), this.x = x, this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
}, (Point || (Point = {})).Origin = "", function(A) {
    var Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    Point.Origin = {
        x: 0,
        y: 0
    }, A.Point = Point, (Point = A.Point || (A.Point = {})).Origin = "";
}(A || (A = {}));
