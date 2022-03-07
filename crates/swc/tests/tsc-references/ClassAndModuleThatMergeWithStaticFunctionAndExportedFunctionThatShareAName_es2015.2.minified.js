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
(Point || (Point = {})).Origin = function() {
    return null;
}, function(A1) {
    class Point1 {
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
    A1.Point = Point1, (Point1 = A1.Point || (A1.Point = {})).Origin = function() {
        return "";
    };
}(A || (A = {}));
