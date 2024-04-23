//// [mod.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
exports.n = {}, exports.n.K = function() {
    this.x = 10;
}, exports.Classic = function _class() {
    _class_call_check(this, _class), this.p = 1;
};
//// [use.js]
import * as s from './mod';
new s.n.K().x, new s.Classic();
