var A;
class Point {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}
Point.Origin = {
    x: 0,
    y: 0
}, (Point || (Point = {})).Origin = "", function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    Point.Origin = {
        x: 0,
        y: 0
    }, A.Point = Point, (Point = A.Point || (A.Point = {})).Origin = "";
}(A || (A = {}));
