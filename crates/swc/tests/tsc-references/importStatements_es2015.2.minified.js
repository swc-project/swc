var A, D, E;
!function(A1) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A1.Point = Point, A1.Origin = new Point(0, 0);
}(A || (A = {})), D || (D = {}), new A.Point(1, 1), function(E1) {
    var a = A;
    E1.xDist = function(x) {
        return a.Origin.x - x.x;
    };
}(E || (E = {}));
