//@filename: part1.ts
var A;
(function(A) {
    var Utils;
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(Utils || (Utils = {
    }));
    A.Utils = Utils;
})(A || (A = {
}));
(function(A) {
    A.Origin = {
        x: 0,
        y: 0
    };
    (function(Utils) {
        class Plane {
            constructor(tl, br){
                this.tl = tl;
                this.br = br;
            }
        }
        Utils.Plane = Plane;
    })(Utils || (Utils = {
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
