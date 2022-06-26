class Point {
    static Origin() {
        return {
            x: 0,
            y: 0
        };
    }
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
(function(Point) {
    function Origin() {
        return null;
    } //expected duplicate identifier error
    Point.Origin = Origin;
})(Point || (Point = {}));
var A;
(function(A) {
    class Point {
        static Origin() {
            return {
                x: 0,
                y: 0
            };
        }
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } //expected duplicate identifier error
        Point.Origin = Origin;
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
