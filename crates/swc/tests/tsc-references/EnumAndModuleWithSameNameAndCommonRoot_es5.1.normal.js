function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var enumdule;
(function(enumdule) {
    enumdule[enumdule["Red"] = 0] = "Red";
    enumdule[enumdule["Blue"] = 1] = "Blue";
})(enumdule || (enumdule = {}));
(function(enumdule) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    enumdule.Point = Point;
})(enumdule || (enumdule = {}));
var x;
var x = enumdule.Red;
var y;
var y = new enumdule.Point(0, 0);
