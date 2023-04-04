//// [ES5SymbolProperty2.ts]
var M;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(M) {
    var _$Symbol, C = function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        return C.prototype[_$Symbol.iterator] = function() {}, C;
    }();
    M.C = C, (new C)[_$Symbol.iterator];
}(M || (M = {})), (new M.C)[Symbol.iterator];
