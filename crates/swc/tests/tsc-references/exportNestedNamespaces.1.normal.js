//// [mod.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
exports.n = {};
exports.n.K = function() {
    this.x = 10;
};
exports.Classic = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.p = 1;
};
//// [use.js]
import * as s from './mod';
var k = new s.n.K();
k.x;
var classic = new s.Classic();
/** @param {s.n.K} c
    @param {s.Classic} classic */ function f(c, classic) {
    c.x;
    classic.p;
}
