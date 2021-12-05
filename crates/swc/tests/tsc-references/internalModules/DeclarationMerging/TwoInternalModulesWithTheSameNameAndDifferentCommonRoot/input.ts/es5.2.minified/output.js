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
})), (function(otherRoot1) {
    var A, A2, Utils, Utils1, Plane;
    (A2 = A || (A = {
    })).Origin = {
        x: 0,
        y: 0
    }, Utils1 = Utils || (Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils1.Plane = Plane, A2.Utils = Utils, otherRoot1.A = A;
})(otherRoot || (otherRoot = {
}));
