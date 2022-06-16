var A;
class Point {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}
Point.Origin = {
    x: 0,
    y: 0
}, Point || (Point = {}), function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    Point.Origin = {
        x: 0,
        y: 0
    }, A.Point = Point, Point = A.Point || (A.Point = {});
}(A || (A = {}));
