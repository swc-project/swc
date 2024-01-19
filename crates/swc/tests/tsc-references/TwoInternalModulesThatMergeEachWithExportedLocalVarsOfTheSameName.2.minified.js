//// [part1.ts]
var A, Utils;
var A1;
export { A1 as A };
Utils = (A = A1 || (A1 = {})).Utils || (A.Utils = {}), Utils.mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
}, A.Origin = {
    x: 0,
    y: 0
};
//// [part2.ts]
var A, Utils;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A1;
export { A1 as A };
A = A1 || (A1 = {}), A.Origin = {
    x: 0,
    y: 0
}, Utils = A.Utils || (A.Utils = {}), Utils.Plane = function Plane(tl, br) {
    _class_call_check(this, Plane), this.tl = tl, this.br = br;
};
