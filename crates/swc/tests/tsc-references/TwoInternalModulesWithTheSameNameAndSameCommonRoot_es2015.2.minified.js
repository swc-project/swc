!function(A1) {
    (A1.Utils || (A1.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(A || (A = {})), function(A2) {
    A2.Origin = {
        x: 0,
        y: 0
    }, (A2.Utils || (A2.Utils = {})).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    };
}(A || (A = {}));
var A, o = A.Origin, o = A.Utils.mirror(o);
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
