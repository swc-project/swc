import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    (A.Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(A || (A = {})), function(A) {
    var Utils, Plane;
    A.Origin = {
        x: 0,
        y: 0
    }, Utils = A.Utils || (A.Utils = {}), Plane = function(tl, br) {
        "use strict";
        _class_call_check(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
}(A || (A = {}));
var A, o = A.Origin, o = A.Utils.mirror(o);
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
