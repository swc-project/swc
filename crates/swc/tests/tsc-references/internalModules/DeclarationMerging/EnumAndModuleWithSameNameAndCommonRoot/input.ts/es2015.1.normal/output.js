let enumdule;
(function(enumdule) {
    enumdule[enumdule["Red"] = 0] = "Red";
    enumdule[enumdule["Blue"] = 1] = "Blue";
})(enumdule || (enumdule = {
}));
(function(enumdule) {
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    enumdule.Point = Point;
})(enumdule || (enumdule = {
}));
var x1;
var x1 = enumdule.Red;
var y1;
var y1 = new enumdule.Point(0, 0);
