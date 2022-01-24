var A;
(function(A1) {
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    var Origin = A1.Origin = {
        x: 0,
        y: 0
    };
    var Unity = A1.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
})(A || (A = {}));
