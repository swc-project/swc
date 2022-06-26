import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @filename: a-ext.js
exports.A = function() {
    this.x = 1;
};
// @filename: a.js
var A = require("./a-ext").A;
/** @param {A} p */ function a(p) {
    p.x;
}
// @filename: b-ext.js
exports.B = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.x = 1;
};
// @filename: b.js
var B = require("./b-ext").B;
/** @param {B} p */ function b(p) {
    p.x;
}
// @filename: c-ext.js
export function C() {
    this.x = 1;
}
// @filename: c.js
var C = require("./c-ext").C;
/** @param {C} p */ function c(p) {
    p.x;
}
// @filename: d-ext.js
export var D = function D() {
    this.x = 1;
};
// @filename: d.js
var D = require("./d-ext").D;
/** @param {D} p */ function d(p) {
    p.x;
}
// @filename: e-ext.js
export var E = function E() {
    "use strict";
    _class_call_check(this, E);
    this.x = 1;
};
// @filename: e.js
var E = require("./e-ext").E;
/** @param {E} p */ function e(p) {
    p.x;
}
// @filename: f.js
var F = function F() {
    this.x = 1;
};
/** @param {F} p */ function f(p) {
    p.x;
}
// @filename: g.js
function G() {
    this.x = 1;
}
/** @param {G} p */ function g(p) {
    p.x;
}
// @filename: h.js
var H = function H() {
    "use strict";
    _class_call_check(this, H);
    this.x = 1;
};
/** @param {H} p */ function h(p) {
    p.x;
}
