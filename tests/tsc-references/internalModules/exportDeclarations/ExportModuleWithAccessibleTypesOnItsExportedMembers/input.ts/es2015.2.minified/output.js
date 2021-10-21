var A1;
!function(A) {
    var B1;
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, (function(B) {
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
    })(B1 || (B1 = {
    })), A.B = B1;
}(A1 || (A1 = {
}));
