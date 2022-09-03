//// [missingAndExcessProperties.ts]
import _throw from "@swc/helpers/src/_throw.mjs";
function f1() {
    var ref = {};
    ref.x, ref.y;
    var ref1 = {};
    ref1.x, ref1.y;
    var ref2 = {};
    ref2.x, ref2.y;
    var ref3 = {};
    ref3.x, ref3.y;
}
function f2() {
    var ref, ref1, ref2, ref3;
    (ref = {}).x, ref.y, (ref1 = {}).x, ref1.y, (ref2 = {}).x, ref2.y, (ref3 = {}).x, ref3.y;
}
function f3() {
    var ref = {
        x: 0,
        y: 0
    }, ref = null !== ref ? ref : _throw(new TypeError("Cannot destructure undefined")), ref1 = {
        x: 0,
        y: 0
    };
    ref1.x, ref1.y;
}
function f4() {
    var ref;
    (ref = {
        x: 0,
        y: 0
    }).x, ref.y;
}
