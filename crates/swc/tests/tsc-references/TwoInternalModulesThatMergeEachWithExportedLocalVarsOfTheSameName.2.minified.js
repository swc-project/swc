//// [part1.ts]
export var A;
!function(A) {
    (A.Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A.Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {}));
//// [part2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A;
!function(A) {
    A.Origin = {
        x: 0,
        y: 0
    }, (A.Utils || (A.Utils = {})).Plane = function Plane(tl, br) {
        "use strict";
        _class_call_check(this, Plane), this.tl = tl, this.br = br;
    };
}(A || (A = {}));
