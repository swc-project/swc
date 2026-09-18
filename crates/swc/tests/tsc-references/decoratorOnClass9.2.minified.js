//// [decoratorOnClass9.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var _B, B = /*#__PURE__*/ function(A) {
    function B() {
        return _class_call_check(this, B), _call_super(this, B, arguments);
    }
    return _inherits(B, A), B.prototype.m = function() {
        return _B.x;
    }, B;
}(function A() {
    _class_call_check(this, A);
});
_B = B, B.x = 1, B.y = _B.x, _B = _ts_decorate([
    dec
], B);
