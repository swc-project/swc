class Point1 {
    static Origin() {
        return {
            x: 0,
            y: 0
        };
    }
    constructor(x1, y1){
        this.x = x1;
        this.y = y1;
    }
}
(function(Point) {
    function Origin() {
        return null;
    } //expected duplicate identifier error
    Point.Origin = Origin;
})(Point1 || (Point1 = {
}));
var A1;
(function(A) {
    class Point2 {
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
    A.Point = Point2;
    (function(Point) {
        function Origin() {
            return "";
        } //expected duplicate identifier error
        Point.Origin = Origin;
    })(Point2 || (Point2 = {
    }));
})(A1 || (A1 = {
}));
