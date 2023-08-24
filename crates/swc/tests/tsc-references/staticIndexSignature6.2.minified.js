//// [staticIndexSignature6.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.foo = function(v) {
        return v;
    }, _class;
}();
C.a, C.a = 1, C[2], C[2] = 42, new C().foo(1);
