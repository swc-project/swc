//// [es6modulekindWithES5Target.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
new WeakMap();
var __1 = new WeakMap();
export var C = /*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C), this.p = 1;
    }
    return C.prototype.method = function() {}, C;
}();
export var D = /*#__PURE__*/ function() {
    function D() {
        _class_call_check(this, D), this.p = 1;
    }
    return D.prototype.method = function() {}, D;
}();
__1.set(D, {
    writable: !0,
    value: D.s = 0
}), D = _ts_decorate([
    foo
], D);
var E = function E() {
    _class_call_check(this, E);
};
export { C as C2, D as D2, E };
