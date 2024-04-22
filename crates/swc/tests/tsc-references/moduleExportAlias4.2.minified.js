//// [bug24024.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
require('./bug24024'), module.exports = function C() {
    _class_call_check(this, C);
}, module.exports.D = function D() {
    _class_call_check(this, D);
};
