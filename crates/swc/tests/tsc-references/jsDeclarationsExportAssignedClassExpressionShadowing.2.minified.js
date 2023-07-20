//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    _class_call_check(this, A), this.member = new Q();
}, Q = function Q() {
    _class_call_check(this, Q), this.x = 42;
};
module.exports = function Q() {
    _class_call_check(this, Q), this.x = new A();
}, module.exports.Another = Q;
