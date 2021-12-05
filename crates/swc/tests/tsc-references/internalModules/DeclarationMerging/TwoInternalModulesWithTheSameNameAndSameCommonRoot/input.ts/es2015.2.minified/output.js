!function(A1) {
    let Utils;
    (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Utils = Utils;
}(A || (A = {
})), (function(A2) {
    A2.Origin = {
        x: 0,
        y: 0
    };
    let Utils;
    (Utils || (Utils = {
    })).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    }, A2.Utils = Utils;
})(A || (A = {
}));
var A, o, o, o = A.Origin, o = A.Utils.mirror(o);
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
