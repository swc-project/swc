function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var enumdule1;
(function(enumdule) {
    enumdule[enumdule["Red"] = 0] = "Red";
    enumdule[enumdule["Blue"] = 1] = "Blue";
})(enumdule1 || (enumdule1 = {
}));
(function(enumdule) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    enumdule.Point = Point;
})(enumdule1 || (enumdule1 = {
}));
var x1;
var x1 = enumdule1.Red;
var y1;
var y1 = new enumdule1.Point(0, 0);
