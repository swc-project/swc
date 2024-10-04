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
var A;
//// [part2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    // not a collision, since we don't export
    var Origin = "0,0";
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
var A;
//// [part3.ts]
// test the merging actually worked
var o;
var o;
var o = A.Origin;
var o = A.Utils.mirror(o);
var p;
var p;
var p = new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
