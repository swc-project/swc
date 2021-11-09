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
        return "";
    } // not an error, since not exported
})(Point1 || (Point1 = {
}));
var A1;
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
    })(Point || (Point = {
    }));
})(A1 || (A1 = {
}));
