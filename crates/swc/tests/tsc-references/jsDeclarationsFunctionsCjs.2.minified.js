//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports.a = function() {}, module.exports.b = function() {}, module.exports.b.cat = "cat", module.exports.c = function() {}, module.exports.c.Cls = function _class() {
    _class_call_check(this, _class);
}, /**
 * @param {number} a
 * @param {number} b
 * @return {string} 
 */ module.exports.d = function(a, b) {
    return /** @type {*} */ null;
}, /**
 * @template T,U
 * @param {T} a
 * @param {U} b
 * @return {T & U} 
 */ module.exports.e = function(a, b) {
    return /** @type {*} */ null;
}, /**
 * @template T
 * @param {T} a
 */ module.exports.f = function(a) {
    return a;
}, module.exports.f.self = module.exports.f, module.exports.g = /**
 * @param {{x: string}} a
 * @param {{y: typeof module.exports.b}} b
 */ function(a, b) {
    return a.x && b.y();
}, module.exports.h = /**
 * @param {{x: string}} a
 * @param {{y: typeof module.exports.b}} b
 */ function(a, b) {
    return a.x && b.y();
}, module.exports.i = function() {}, module.exports.ii = module.exports.i, // note that this last one doesn't make much sense in cjs, since exports aren't hoisted bindings
module.exports.jj = module.exports.j, module.exports.j = function() {};
