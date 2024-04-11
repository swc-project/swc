//// [decoratorOnClassMethod12.ts]
var M, C;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
M || (M = {}), C = function(S) {
    _inherits(C, S);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C.prototype.method = function() {}, C;
}(function() {
    function S() {
        _class_call_check(this, S);
    }
    return S.prototype.decorator = function(target, key) {}, S;
}()), _ts_decorate([
    super.decorator
], C.prototype, "method", null);
