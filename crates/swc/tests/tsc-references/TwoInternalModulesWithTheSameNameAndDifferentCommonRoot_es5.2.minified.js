var Root, otherRoot;
!function(Root1) {
    var A;
    ((A = Root1.A || (Root1.A = {})).Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(Root || (Root = {})), (function(otherRoot1) {
    var A, Utils, Plane;
    (A = otherRoot1.A || (otherRoot1.A = {})).Origin = {
        x: 0,
        y: 0
    }, Utils = A.Utils || (A.Utils = {}), Plane = function(tl, br) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
})(otherRoot || (otherRoot = {}));
