var A;
!function(A) {
    class Point {
    }
    A.Origin = {
        x: 0,
        y: 0
    }, A.Point3d = class extends Point {
    }, A.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    }, A.Line = class {
        static fromorigin2d(p) {
            return null;
        }
        constructor(start, end){
            this.start = start, this.end = end;
        }
    };
}(A || (A = {}));
