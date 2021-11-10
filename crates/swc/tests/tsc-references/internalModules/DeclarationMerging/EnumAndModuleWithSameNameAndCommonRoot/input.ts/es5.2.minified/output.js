var enumdule2, enumdule1;
(enumdule2 = enumdule1 || (enumdule1 = {
}))[enumdule2.Red = 0] = "Red", enumdule2[enumdule2.Blue = 1] = "Blue", (function(enumdule) {
    var Point = function(x, y) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Point), this.x = x, this.y = y;
    };
    enumdule.Point = Point;
})(enumdule1 || (enumdule1 = {
})), enumdule1.Red, new enumdule1.Point(0, 0);
