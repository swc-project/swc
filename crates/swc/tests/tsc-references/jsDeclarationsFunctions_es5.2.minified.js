import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export function a() {}
export function b() {}
b.cat = "cat";
export function c() {}
c.Cls = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
export function d() {
    return null;
}
export function e() {
    return null;
}
export function f(a1) {
    return a1;
}
function g(a2, b1) {
    return a2.x && b1.y();
}
f.self = f;
function hh(a3, b2) {
    return a3.x && b2.y();
}
export function i() {}
export function j() {}
export { g, hh as h, i as ii, j as jj };
