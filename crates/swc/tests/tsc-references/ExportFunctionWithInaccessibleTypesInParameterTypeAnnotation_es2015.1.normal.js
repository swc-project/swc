var A;
(function(A1) {
    class Point {
    }
    class Line {
        constructor(start, end){
            this.start = start;
            this.end = end;
        }
    }
    A1.Line = Line;
    function fromOrigin(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    }
    A1.fromOrigin = fromOrigin;
})(A || (A = {}));
