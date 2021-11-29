var A;
(class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}).Origin = {
    x: 0,
    y: 0
}, (function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Point = Point, Point.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {
}));
