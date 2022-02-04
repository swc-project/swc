var A;
!function(A1) {
    A1.Point = class {
    };
    class Line {
        constructor(start, end){
            this.start = start, this.end = end;
        }
    }
    A1.Line = Line, A1.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A || (A = {}));
