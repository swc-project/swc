var A;
((A = A1 || (A1 = {
})).Utils || (A.Utils = {
})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
}, A.Origin = {
    x: 0,
    y: 0
}, (function(A2) {
    var Utils, Plane;
    Utils = A2.Utils || (A2.Utils = {
    }), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
})(A1 || (A1 = {
}));
var A1, o, o, o = A1.Origin, o = A1.Utils.mirror(o);
new A1.Utils.Plane(o, {
    x: 1,
    y: 1
});
