var enumdule;
(function(enumdule1) {
    enumdule1[enumdule1["Red"] = 0] = "Red";
    enumdule1[enumdule1["Blue"] = 1] = "Blue";
})(enumdule || (enumdule = {
}));
(function(enumdule2) {
    class Point {
        constructor(x1, y1){
            this.x = x1;
            this.y = y1;
        }
    }
    enumdule2.Point = Point;
})(enumdule || (enumdule = {
}));
var x;
var x = enumdule.Red;
var y;
var y = new enumdule.Point(0, 0);
