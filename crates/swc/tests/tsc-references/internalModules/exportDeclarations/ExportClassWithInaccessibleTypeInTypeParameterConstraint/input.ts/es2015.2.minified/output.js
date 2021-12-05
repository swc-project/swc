var A;
!function(A1) {
    class Point {
    }
    A1.Origin = {
        x: 0,
        y: 0
    }, A1.Point3d = class extends Point {
    }, A1.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    }, A1.Line = class {
        static fromorigin2d(p) {
            return null;
        }
        constructor(start, end){
            this.start = start, this.end = end;
        }
    };
}(A || (A = {
}));
