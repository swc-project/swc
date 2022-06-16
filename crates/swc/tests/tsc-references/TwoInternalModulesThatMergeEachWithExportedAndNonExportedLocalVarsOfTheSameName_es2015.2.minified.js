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
    (A.Utils || (A.Utils = {})).Plane = class {
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
