//@filename: part1.ts
var A;
(function(A1) {
    let Utils1;
    (function(Utils) {
        function mirror(p1) {
            return {
                x: p1.y,
                y: p1.x
            };
        }
        Utils.mirror = mirror;
    })(Utils1 = A1.Utils || (A1.Utils = {
    }));
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
//@filename: part3.ts
// test the merging actually worked
var o;
var o;
var o = A.Origin;
var o = A.Utils.mirror(o);
var p;
var p;
var p = new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
