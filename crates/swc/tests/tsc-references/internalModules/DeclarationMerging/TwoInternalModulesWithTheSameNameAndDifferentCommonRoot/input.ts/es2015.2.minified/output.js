var Root, otherRoot;
!function(Root1) {
    var A;
    let A1, Utils;
    A = A1 || (A1 = {
    }), (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Utils = Utils, Root1.A = A1;
}(Root || (Root = {
})), (function(otherRoot1) {
    var A;
    let A2, Utils;
    (A = A2 || (A2 = {
    })).Origin = {
        x: 0,
        y: 0
    }, (Utils || (Utils = {
    })).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    }, A.Utils = Utils, otherRoot1.A = A2;
})(otherRoot || (otherRoot = {
}));
