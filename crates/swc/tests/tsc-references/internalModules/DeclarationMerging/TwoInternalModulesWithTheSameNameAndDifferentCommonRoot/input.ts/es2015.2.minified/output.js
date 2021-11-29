var Root, otherRoot;
!function(Root) {
    var A, Utils;
    let A, Utils;
    A = A || (A = {
    }), (Utils = Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Utils = Utils, Root.A = A;
}(Root || (Root = {
})), (function(otherRoot) {
    var A, Utils;
    let A, Utils;
    (A = A || (A = {
    })).Origin = {
        x: 0,
        y: 0
    }, (Utils = Utils || (Utils = {
    })).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    }, A.Utils = Utils, otherRoot.A = A;
})(otherRoot || (otherRoot = {
}));
