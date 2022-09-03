//// [part1.ts]
var A;
!function(A) {
    (A.Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {}));
//// [part2.ts]
var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var Utils, Plane;
    Utils = A.Utils || (A.Utils = {}), Plane = function Plane(tl, br) {
        "use strict";
        _class_call_check(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
}(A || (A = {}));
//// [part3.ts]
var o, p, o = A.Origin, o = A.Utils.mirror(o), p = new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
