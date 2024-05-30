//// [part1.ts]
var A;
((A = {}).Utils || (A.Utils = {})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
}, A.Origin = {
    x: 0,
    y: 0
};
//// [part2.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
((A = {}).Utils || (A.Utils = {})).Plane = function Plane(tl, br) {
    _class_call_check(this, Plane), this.tl = tl, this.br = br;
};
//// [part3.ts]
var o = A.Origin, o = A.Utils.mirror(o);
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
