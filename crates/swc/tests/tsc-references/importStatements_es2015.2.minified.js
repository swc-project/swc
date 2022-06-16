var A, C, D, E;
!function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, A.Origin = new Point(0, 0);
}(A || (A = {})), C || (C = {}), D || (D = {}), new A.Point(1, 1), function(E) {
    var a = A;
    E.xDist = function(x) {
        return a.Origin.x - x.x;
    };
}(E || (E = {}));
