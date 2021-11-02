var A1;
class Point1 {
    static Origin() {
        return {
            x: 0,
            y: 0
        };
    }
    constructor(x1, y1){
        this.x = x1, this.y = y1;
    }
}
(Point1 || (Point1 = {
})).Origin = function() {
    return null;
}, (function(A) {
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
    A.Point = Point, (Point || (Point = {
    })).Origin = function() {
        return "";
    };
})(A1 || (A1 = {
}));
