export var A;
!function(A) {
    var Utils, Utils;
    (Utils = Utils || (Utils = {
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
})), (function(A) {
    var Utils, Utils, Plane;
    A.Origin = {
        x: 0,
        y: 0
    }, Utils = Utils || (Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane, A.Utils = Utils;
})(A || (A = {
}));
