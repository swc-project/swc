export var A;
!function(A) {
    (A.Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), function(A) {
    A.Origin = {
        x: 0,
        y: 0
    }, (A.Utils || (A.Utils = {})).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    };
}(A || (A = {}));
