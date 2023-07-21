//// [part1.ts]
var Root, Root1, A;
((A = (Root1 = Root || (Root = {})).A || (Root1.A = {})).Utils || (A.Utils = {})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
};
//// [part2.ts]
var otherRoot, otherRoot1, A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A = (otherRoot1 = otherRoot || (otherRoot = {})).A || (otherRoot1.A = {})).Origin = {
    x: 0,
    y: 0
}, (A.Utils || (A.Utils = {})).Plane = function Plane(tl, br) {
    _class_call_check(this, Plane), this.tl = tl, this.br = br;
};
