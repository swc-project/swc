//// [decoratorOnClass9.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
// https://github.com/Microsoft/TypeScript/issues/16417
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
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
