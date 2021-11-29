var Root, otherRoot;
!function(Root) {
    var A, A, Utils, Utils;
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
    var A, A, Utils, Utils, Plane;
    (A = A || (A = {
    })).Origin = {
        x: 0,
        y: 0
    }, Utils = Utils || (Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane, A.Utils = Utils, otherRoot.A = A;
})(otherRoot || (otherRoot = {
}));
