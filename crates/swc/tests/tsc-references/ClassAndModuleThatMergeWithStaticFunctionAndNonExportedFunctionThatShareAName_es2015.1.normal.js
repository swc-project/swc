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
        return "";
    } // not an error, since not exported
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
        } // not an error since not exported
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
