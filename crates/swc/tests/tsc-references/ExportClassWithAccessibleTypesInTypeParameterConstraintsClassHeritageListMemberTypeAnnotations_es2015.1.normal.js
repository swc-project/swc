var A;
(function(A) {
    class Point {
    }
    A.Point = Point;
    var Origin = A.Origin = {
        x: 0,
        y: 0
    };
    class Point3d extends Point {
    }
    A.Point3d = Point3d;
    var Origin3d = A.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    class Line {
        constructor(start, end){
            this.start = start;
            this.end = end;
        }
    }
    A.Line = Line;
})(A || (A = {}));
