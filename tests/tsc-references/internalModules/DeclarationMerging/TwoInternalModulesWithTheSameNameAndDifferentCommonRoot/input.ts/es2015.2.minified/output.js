var Root1, otherRoot;
!function(Root) {
    var A, A1, Utils;
    A1 = A || (A = {
    }), (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Utils = Utils, Root.A = A;
}(Root1 || (Root1 = {
})), otherRoot || (otherRoot = {
}), (A || (A = {
})).Origin = {
    x: 0,
    y: 0
}, (Utils || (Utils = {
})).Plane = class {
    constructor(tl, br){
        this.tl = tl, this.br = br;
    }
};
