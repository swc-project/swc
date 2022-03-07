var A;
(class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}).Origin = {
    x: 0,
    y: 0
}, function(A1) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    Point.Origin = {
        x: 0,
        y: 0
    }, A1.Point = Point;
}(A || (A = {}));
