import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
//@filename: part1.ts
var A;
(function(A) {
    var Utils;
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(Utils = A.Utils || (A.Utils = {}));
    var Origin = A.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
(function(A) {
    // not a collision, since we don't export
    var Origin = "0,0";
    var Utils;
    (function(Utils) {
        var Plane = function Plane(tl, br) {
            "use strict";
            _class_call_check(this, Plane);
            this.tl = tl;
            this.br = br;
        };
        Utils.Plane = Plane;
    })(Utils = A.Utils || (A.Utils = {}));
})(A || (A = {}));
//@filename: part3.ts
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
