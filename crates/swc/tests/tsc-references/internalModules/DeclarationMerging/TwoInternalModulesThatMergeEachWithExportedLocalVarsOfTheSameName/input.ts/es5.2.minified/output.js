export var A;
!function(A1) {
    var Utils;
    (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Origin = {
        x: 0,
        y: 0
    }, A1.Utils = Utils;
}(A || (A = {
})), (function(A2) {
    var Utils1, Plane;
    A2.Origin = {
        x: 0,
        y: 0
    }, Utils1 = Utils || (Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils1.Plane = Plane;
})(A || (A = {
}));
