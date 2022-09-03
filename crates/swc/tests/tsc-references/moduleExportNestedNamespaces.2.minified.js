//// [mod.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports.n = {}, module.exports.n.K = function() {
    this.x = 10;
}, module.exports.Classic = function _class() {
    "use strict";
    _class_call_check(this, _class), this.p = 1;
};
//// [use.js]
import * as s from "./mod";
var k = new s.n.K();
k.x;
var classic = new s.Classic();
function f(c, classic) {
    c.x, classic.p;
}
