//@filename: part1.ts
export var A;
(function(A1) {
    let Utils1;
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(Utils1 = A1.Utils || (A1.Utils = {
    }));
    A1.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {
}));
(function(A2) {
    A2.Origin = {
        x: 0,
        y: 0
    };
    let Utils2;
    (function(Utils) {
        class Plane {
            constructor(tl, br){
                this.tl = tl;
                this.br = br;
            }
        }
        Utils.Plane = Plane;
    })(Utils2 = A2.Utils || (A2.Utils = {
    }));
})(A || (A = {
}));
