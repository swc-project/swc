var A;
(function(A) {
    class Point2d {
        fromOrigin(p) {
            return 1;
        }
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point2d = Point2d;
})(A || (A = {}));
