//// [part1.ts]
var Root;
!function(Root) {
    var A;
    ((A = Root.A || (Root.A = {})).Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(Root || (Root = {}));
//// [part2.ts]
var otherRoot;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(otherRoot) {
    var A;
    (A = otherRoot.A || (otherRoot.A = {})).Origin = {
        x: 0,
        y: 0
    }, (A.Utils || (A.Utils = {})).Plane = function Plane(tl, br) {
        "use strict";
        _class_call_check(this, Plane), this.tl = tl, this.br = br;
    };
}(otherRoot || (otherRoot = {}));
