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
(Point || (Point = {
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
})(A || (A = {
}));
