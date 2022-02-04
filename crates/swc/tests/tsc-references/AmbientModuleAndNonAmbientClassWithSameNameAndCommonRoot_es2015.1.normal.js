// @filename: classPoint.ts
var A;
(function(A1) {
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A1.Point = Point;
})(A || (A = {}));
// @filename: test.ts
var p;
var p = A.Point.Origin;
var p = new A.Point(0, 0); // unexpected error here, bug 840000
