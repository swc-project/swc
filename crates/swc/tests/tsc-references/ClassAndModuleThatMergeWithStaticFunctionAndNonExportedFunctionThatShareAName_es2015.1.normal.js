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
(function(A1) {
    class Point1 {
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
    A1.Point = Point1;
    (function(Point) {
        function Origin() {
            return "";
        } // not an error since not exported
    })(Point1 = A1.Point || (A1.Point = {}));
})(A || (A = {}));
