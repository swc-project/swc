var A;
!function(A) {
    class Line {
        constructor(start, end){
            this.start = start, this.end = end;
        }
    }
    A.Line = Line, A.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A || (A = {}));
