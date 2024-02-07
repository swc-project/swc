//// [decoratorOnClass9.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var B = function(A) {
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.m = function() {
        return B.x;
    }, B;
}(function A() {
    _class_call_check(this, A);
});
B.x = 1, B.y = B.x, _ts_decorate([
    dec
], B);
