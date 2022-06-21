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
export function f(a) {
    return a;
}
function g(a, b) {
    return a.x && b.y();
}
f.self = f;
function hh(a, b) {
    return a.x && b.y();
}
export function i() {}
export function j() {}
export { g, hh as h, i as ii, j as jj };
