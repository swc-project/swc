import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: use.js
import * as s from "./mod";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: mod.js
exports.n = {};
exports.n.K = function() {
    this.x = 10;
};
exports.Classic = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.p = 1;
};
var k = new s.n.K();
k.x;
var classic = new s.Classic();
/** @param {s.n.K} c
    @param {s.Classic} classic */ function f(c, classic1) {
    c.x;
    classic1.p;
}
