var Root, otherRoot;
!function(Root1) {
    var A, A1, Utils;
    A1 = A || (A = {
    }), (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Utils = Utils, Root1.A = A;
}(Root || (Root = {
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
