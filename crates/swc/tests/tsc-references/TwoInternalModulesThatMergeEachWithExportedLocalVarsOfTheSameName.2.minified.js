//// [part1.ts]
var A;
((A = A1 || (A1 = {})).Utils || (A.Utils = {})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
}, A.Origin = {
    x: 0,
    y: 0
};
var A1;
export { A1 as A };
//// [part2.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A = A1 || (A1 = {})).Origin = {
    x: 0,
    y: 0
}, (A.Utils || (A.Utils = {})).Plane = function Plane(tl, br) {
    _class_call_check(this, Plane), this.tl = tl, this.br = br;
};
var A1;
export { A1 as A };
