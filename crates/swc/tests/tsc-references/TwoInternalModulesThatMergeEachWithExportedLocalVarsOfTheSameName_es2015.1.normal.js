//@filename: part1.ts
export var A;
(function(A) {
    let Utils;
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(Utils = A.Utils || (A.Utils = {}));
    var Origin = A.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
(function(A) {
    var Origin = A.Origin = {
        x: 0,
        y: 0
    };
    let Utils;
    (function(Utils) {
        class Plane {
            constructor(tl, br){
                this.tl = tl;
                this.br = br;
            }
        }
        Utils.Plane = Plane;
    })(Utils = A.Utils || (A.Utils = {}));
})(A || (A = {}));
