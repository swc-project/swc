//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export function a() {}
export function b() {}
b.cat = "cat";
export function c() {}
c.Cls = function _class() {
    _class_call_check(this, _class);
};
export function d(a, b) {
    return null;
}
export function e(a, b) {
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
