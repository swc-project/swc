var X, X1;
((X1 = X || (X = {
})).Y || (X1.Y = {
})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}, (function(X2) {
    var Y;
    let Point;
    (Point = (Y = X2.Y || (X2.Y = {
    })).Point || (Y.Point = {
    })).Origin = new Point(0, 0);
})(X || (X = {
})), new X.Y.Point(1, 1), X.Y.Point.Origin;
class A {
}
(A || (A = {
})).Instance = new A(), new A();
