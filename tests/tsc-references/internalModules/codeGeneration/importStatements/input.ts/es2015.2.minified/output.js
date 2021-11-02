var A1, D, E1;
!function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, A.Origin = new Point(0, 0);
}(A1 || (A1 = {
})), D || (D = {
}), new A1.Point(1, 1), (function(E) {
    var a = A1;
    E.xDist = function(x) {
        return a.Origin.x - x.x;
    };
})(E1 || (E1 = {
}));
