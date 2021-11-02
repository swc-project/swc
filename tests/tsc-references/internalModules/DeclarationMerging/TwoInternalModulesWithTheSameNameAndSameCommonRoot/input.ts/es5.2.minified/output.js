!function(A) {
    var Utils;
    (Utils || (Utils = {
    })).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Utils = Utils;
}(A1 || (A1 = {
})), (function(A) {
    var Utils1, Plane;
    A.Origin = {
        x: 0,
        y: 0
    }, Utils1 = Utils || (Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils1.Plane = Plane;
})(A1 || (A1 = {
}));
var A1, o, o, o = A1.Origin, o = A1.Utils.mirror(o);
new A1.Utils.Plane(o, {
    x: 1,
    y: 1
});
