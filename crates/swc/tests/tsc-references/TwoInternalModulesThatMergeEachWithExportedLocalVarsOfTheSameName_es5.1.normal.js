import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
//@filename: part1.ts
export var A;
(function(A1) {
    var Utils1;
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(Utils1 = A1.Utils || (A1.Utils = {}));
    var Origin = A1.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
(function(A2) {
    var Origin = A2.Origin = {
        x: 0,
        y: 0
    };
    var Utils2;
    (function(Utils) {
        var Plane = function Plane(tl, br) {
            "use strict";
            _class_call_check(this, Plane);
            this.tl = tl;
            this.br = br;
        };
        Utils.Plane = Plane;
    })(Utils2 = A2.Utils || (A2.Utils = {}));
})(A || (A = {}));
