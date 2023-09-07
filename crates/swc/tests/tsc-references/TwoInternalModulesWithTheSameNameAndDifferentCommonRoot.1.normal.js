//// [part1.ts]
var Root;
(function(Root) {
    var A;
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
    })(A = Root.A || (Root.A = {}));
})(Root || (Root = {}));
//// [part2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var otherRoot;
(function(otherRoot) {
    var A;
    (function(A) {
        var Origin = {
            x: 0,
            y: 0
        };
        // have to be fully qualified since in different root
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
    })(A = otherRoot.A || (otherRoot.A = {}));
})(otherRoot || (otherRoot = {}));
