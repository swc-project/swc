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
!function(Point1) {
    function Origin() {
        return null;
    }
    Point1.Origin = Origin;
}(Point || (Point = {})), function(A1) {
    class Point2 {
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
    A1.Point = Point2, function(Point3) {
        function Origin() {
            return "";
        }
        Point3.Origin = Origin;
    }(Point2 = A1.Point || (A1.Point = {}));
}(A || (A = {}));
