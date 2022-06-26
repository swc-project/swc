var A;
!function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, function(B) {
        B.Origin = new Point(0, 0);
        class Line {
            static fromOrigin(p) {
                return new Line({
                    x: 0,
                    y: 0
                }, p);
            }
            constructor(start, end){}
        }
        B.Line = Line;
    }(A.B || (A.B = {}));
}(A || (A = {}));
