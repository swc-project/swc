var A;
!function(A) {
    class Point {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    A.Origin = {
        x: 0,
        y: 0
    }, A.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
}(A || (A = {}));
