var A;
(function(A1) {
    class Point {
    }
    A1.Point = Point;
    var Origin = A1.Origin = {
        x: 0,
        y: 0
    };
    class Point3d extends Point {
    }
    A1.Point3d = Point3d;
    var Origin3d = A1.Origin3d = {
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
    A1.Line = Line;
})(A || (A = {}));
