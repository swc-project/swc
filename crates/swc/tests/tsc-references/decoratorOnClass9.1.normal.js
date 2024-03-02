//// [decoratorOnClass9.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
// https://github.com/Microsoft/TypeScript/issues/16417
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.m = function m() {
        return B.x;
    };
    return B;
}(A);
B.x = 1;
B.y = B.x;
B = _ts_decorate([
    dec
], B);
