//// [decoratorOnClassMethod12.ts]
var M, C;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
M || (M = {}), C = /*#__PURE__*/ function(S) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, S), C.prototype.method = function() {}, C;
}(/*#__PURE__*/ function() {
    function S() {
        _class_call_check(this, S);
    }
    return S.prototype.decorator = function(target, key) {}, S;
}()), _ts_decorate([
    super.decorator
], C.prototype, "method", null);
