//// [part1.ts]
var A, A1;
((A1 = A || (A = {})).Utils || (A1.Utils = {})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
};
//// [part2.ts]
var A, A1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A1 = A || (A = {})).Origin = {
    x: 0,
    y: 0
}, (A1.Utils || (A1.Utils = {})).Plane = function Plane(tl, br) {
    _class_call_check(this, Plane), this.tl = tl, this.br = br;
};
//// [part3.ts]
var o = A.Origin, o = A.Utils.mirror(o);
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
