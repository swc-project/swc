var enumdule;
(function(enumdule1) {
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    enumdule1.Point = Point;
})(enumdule || (enumdule = {}));
(function(enumdule) {
    enumdule[enumdule["Red"] = 0] = "Red";
    enumdule[enumdule["Blue"] = 1] = "Blue";
})(enumdule || (enumdule = {}));
var x;
var x = enumdule.Red;
var y;
var y = new enumdule.Point(0, 0);
