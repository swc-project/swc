var A;
(class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}).Origin = {
    x: 0,
    y: 0
}, (function(A1) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A1.Point = Point, Point.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {
}));
