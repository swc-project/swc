export function a() {}
export function b() {}
b.cat = "cat";
export function c() {}
c.Cls = function _class() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, _class);
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
