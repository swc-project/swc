var A;
class Point {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}
Point.Origin = {
    x: 0,
    y: 0
}, (Point || (Point = {
})).Origin = "", (function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, Point.Origin = {
        x: 0,
        y: 0
    }, (Point || (Point = {
    })).Origin = "";
})(A || (A = {
}));
