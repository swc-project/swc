import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export var A;
!function(A1) {
    (A1.Utils || (A1.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), function(A2) {
    var Utils, Plane;
    A2.Origin = {
        x: 0,
        y: 0
    }, Utils = A2.Utils || (A2.Utils = {}), Plane = function(tl, br) {
        "use strict";
        _class_call_check(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
}(A || (A = {}));
