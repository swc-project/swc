var Root, otherRoot;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(Root) {
    var A;
    ((A = Root.A || (Root.A = {})).Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(Root || (Root = {})), function(otherRoot) {
    var A, Utils, Plane;
    (A = otherRoot.A || (otherRoot.A = {})).Origin = {
        x: 0,
        y: 0
    }, Utils = A.Utils || (A.Utils = {}), Plane = function(tl, br) {
        "use strict";
        _class_call_check(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
}(otherRoot || (otherRoot = {}));
