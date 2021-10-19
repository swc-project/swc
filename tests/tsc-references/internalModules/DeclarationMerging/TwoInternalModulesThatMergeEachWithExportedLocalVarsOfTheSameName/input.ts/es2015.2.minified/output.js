var A;
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
