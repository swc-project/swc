!function(A1) {
    var Utils;
    (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Utils = Utils;
}(A || (A = {
})), (A || (A = {
})).Origin = {
    x: 0,
    y: 0
}, (Utils || (Utils = {
})).Plane = class {
    constructor(tl, br){
        this.tl = tl, this.br = br;
    }
};
var A, o, o, o = A.Origin, o = A.Utils.mirror(o);
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
