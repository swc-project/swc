var A;
(function(A) {
    class Point {
    }
    class Line {
        constructor(start, end){
            this.start = start;
            this.end = end;
        }
    }
    A.Line = Line;
    function fromOrigin(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    }
    A.fromOrigin = fromOrigin;
})(A || (A = {}));
