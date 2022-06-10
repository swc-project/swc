import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
//@filename: part1.ts
var A;
(function(A1) {
    var Utils1;
    (function(Utils) {
        function mirror(p1) {
            return {
                x: p1.y,
                y: p1.x
            };
        }
        Utils.mirror = mirror;
    })(Utils1 = A1.Utils || (A1.Utils = {}));
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
