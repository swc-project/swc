import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: index.js
export function a() {}
export function b() {}
b.cat = "cat";
export function c() {}
c.Cls = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
/**
 * @param {number} a
 * @param {number} b
 * @return {string} 
 */ export function d(a, b) {
    return /** @type {*} */ (null);
}
/**
 * @template T,U
 * @param {T} a
 * @param {U} b
 * @return {T & U} 
 */ export function e(a, b) {
    return /** @type {*} */ (null);
}
/**
 * @template T
 * @param {T} a
 */ export function f(a1) {
    return a1;
}
f.self = f;
/**
 * @param {{x: string}} a
 * @param {{y: typeof b}} b
 */ function g(a2, b1) {
    return a2.x && b1.y();
}
export { g };
/**
 * @param {{x: string}} a
 * @param {{y: typeof b}} b
 */ function hh(a3, b2) {
    return a3.x && b2.y();
}
export { hh as h };
export function i() {}
export { i as ii };
export { j as jj };
export function j() {}
