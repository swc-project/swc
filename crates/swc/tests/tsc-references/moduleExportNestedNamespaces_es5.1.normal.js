// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: mod.js
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: use.js
import * as s from "./mod";
module.exports.n = {};
module.exports.n.K = function C() {
    this.x = 10;
};
module.exports.Classic = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.p = 1;
};
var k = new s.n.K();
k.x;
var classic = new s.Classic();
/** @param {s.n.K} c
    @param {s.Classic} classic */ function f(c, classic) {
    c.x;
    classic.p;
}
