//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    return /** @type {*} */ null;
}
/**
 * @template T,U
 * @param {T} a
 * @param {U} b
 * @return {T & U} 
 */ export function e(a, b) {
    return /** @type {*} */ null;
}
/**
 * @template T
 * @param {T} a
 */ export function f(a) {
    return a;
}
f.self = f;
/**
 * @param {{x: string}} a
 * @param {{y: typeof b}} b
 */ function g(a, b) {
    return a.x && b.y();
}
export { g };
/**
 * @param {{x: string}} a
 * @param {{y: typeof b}} b
 */ function hh(a, b) {
    return a.x && b.y();
}
export { hh as h };
export function i() {}
export { i as ii };
export { j as jj };
export function j() {}
