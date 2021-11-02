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
})), (function(otherRoot) {
    var Utils1, Plane;
    (A || (A = {
    })).Origin = {
        x: 0,
        y: 0
    }, Utils1 = Utils || (Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils1.Plane = Plane;
})(otherRoot || (otherRoot = {
}));
