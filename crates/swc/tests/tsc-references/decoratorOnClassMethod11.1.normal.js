//// [decoratorOnClassMethod11.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var M;
(function(M) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        _proto.decorator = function decorator(target, key) {};
        _proto.method = function method() {};
        return C;
    }();
    _ts_decorate([
        _this.decorator
    ], C.prototype, "method", null);
})(M || (M = {}));
