// @filename: classPoint.ts
var A1;
(function(A) {
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point;
})(A1 || (A1 = {
}));
// @filename: test.ts
var p;
var p = A1.Point.Origin;
var p = new A1.Point(0, 0); // unexpected error here, bug 840000
