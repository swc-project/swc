//// [part1.ts]
(function(A) {
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(A.Utils || (A.Utils = {}));
    A.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
export var A;
//// [part2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    A.Origin = {
        x: 0,
        y: 0
    };
    (function(Utils) {
        var Plane = function Plane(tl, br) {
            "use strict";
            _class_call_check(this, Plane);
            this.tl = tl;
            this.br = br;
        };
        Utils.Plane = Plane;
    })(A.Utils || (A.Utils = {}));
})(A || (A = {}));
export var A;
