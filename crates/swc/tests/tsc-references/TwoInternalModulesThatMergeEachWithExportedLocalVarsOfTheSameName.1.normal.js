//// [part1.ts]
export var A;
(function(A) {
    var Utils;
    (function(Utils) {
        var mirror = function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        };
        Utils.mirror = mirror;
    })(Utils = A.Utils || (A.Utils = {}));
    var Origin = {
        x: 0,
        y: 0
    };
    Object.defineProperty(A, "Origin", {
        enumerable: true,
        get: function get() {
            return Origin;
        },
        set: function set(v) {
            Origin = v;
        }
    });
})(A || (A = {}));
//// [part2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A;
(function(A) {
    var Origin = {
        x: 0,
        y: 0
    };
    // collision with 'Origin' var in other part of merged module
    Object.defineProperty(A, "Origin", {
        enumerable: true,
        get: function get() {
            return Origin;
        },
        set: function set(v) {
            Origin = v;
        }
    });
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
