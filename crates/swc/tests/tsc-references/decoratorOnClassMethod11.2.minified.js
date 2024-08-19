//// [decoratorOnClassMethod11.ts]
var M;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
!function(M) {
    var C = /*#__PURE__*/ function() {
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        return _proto.decorator = function(target, key) {}, _proto.method = function() {}, C;
    }();
    _ts_decorate([
        this.decorator
    ], C.prototype, "method", null);
}(M || (M = {}));
