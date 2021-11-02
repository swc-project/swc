!function(A) {
    var Utils;
    (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Origin = {
        x: 0,
        y: 0
    }, A.Utils = Utils;
}(A1 || (A1 = {
})), A1 || (A1 = {
}), (Utils || (Utils = {
})).Plane = class {
    constructor(tl, br){
        this.tl = tl, this.br = br;
    }
};
var A1, o, o, o = A1.Origin, o = A1.Utils.mirror(o);
new A1.Utils.Plane(o, {
    x: 1,
    y: 1
});
