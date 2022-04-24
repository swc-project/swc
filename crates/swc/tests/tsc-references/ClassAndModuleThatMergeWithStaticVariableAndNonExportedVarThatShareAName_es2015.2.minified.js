var A;
class Point {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}
Point.Origin = {
    x: 0,
    y: 0
}, Point || (Point = {}), function(A1) {
    class Point1 {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    Point1.Origin = {
        x: 0,
        y: 0
    }, A1.Point = Point1, Point1 = A1.Point || (A1.Point = {});
}(A || (A = {}));
