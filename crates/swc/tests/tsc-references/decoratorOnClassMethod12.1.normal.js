//// [decoratorOnClassMethod12.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var M;
(function(M) {
    var S = /*#__PURE__*/ function() {
        "use strict";
        function S() {
            _class_call_check(this, S);
        }
        var _proto = S.prototype;
        _proto.decorator = function decorator(target, key) {};
        return S;
    }();
    var C = /*#__PURE__*/ function(S) {
        "use strict";
        _inherits(C, S);
        var _super = _create_super(C);
        function C() {
            _class_call_check(this, C);
            return _super.apply(this, arguments);
        }
        var _proto = C.prototype;
        _proto.method = function method() {};
        return C;
    }(S);
    _ts_decorate([
        super.decorator
    ], C.prototype, "method", null);
})(M || (M = {}));
