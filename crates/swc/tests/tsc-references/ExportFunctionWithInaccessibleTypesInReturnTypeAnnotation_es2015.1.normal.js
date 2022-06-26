var A;
(function(A) {
    class Point {
    }
    A.Point = Point;
    class Line {
        constructor(start, end){
            this.start = start;
            this.end = end;
        }
    }
    function fromOrigin(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    }
    A.fromOrigin = fromOrigin;
})(A || (A = {}));
