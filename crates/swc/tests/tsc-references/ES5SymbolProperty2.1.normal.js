//// [ES5SymbolProperty2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M) {
    var _$Symbol;
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        _proto[_$Symbol.iterator] = function() {};
        return C;
    }();
    M.C = C;
    (new C)[_$Symbol.iterator];
})(M || (M = {}));
(new M.C)[Symbol.iterator];
var M;
