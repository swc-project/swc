var A;
class Point {
    static Origin() {
        return {
            x: 0,
            y: 0
        };
    }
    constructor(x, y){
        this.x = x, this.y = y;
    }
}
!function(Point) {
    function Origin() {
        return null;
    }
    Point.Origin = Origin;
}(Point || (Point = {})), function(A) {
    class Point {
        static Origin() {
            return {
                x: 0,
                y: 0
            };
        }
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, function(Point) {
        function Origin() {
            return "";
        }
        Point.Origin = Origin;
    }(Point = A.Point || (A.Point = {}));
}(A || (A = {}));
