var A;
!function(A1) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A1.Point = Point;
    let B1;
    !function(B) {
        B.Origin = new Point(0, 0);
        class Line {
            static fromOrigin(p) {
                return new Line({
                    x: 0,
                    y: 0
                }, p);
            }
            constructor(start, end){
            }
        }
        B.Line = Line;
    }(B1 || (B1 = {
    })), A1.B = B1;
}(A || (A = {
}));
