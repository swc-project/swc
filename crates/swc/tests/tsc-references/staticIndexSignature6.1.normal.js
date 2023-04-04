//// [staticIndexSignature6.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo() {
    return /*#__PURE__*/ function() {
        "use strict";
        function _class() {
            _class_call_check(this, _class);
        }
        var _proto = _class.prototype;
        _proto.foo = function foo(v) {
            return v;
        };
        return _class;
    }();
}
var C = foo();
C.a;
C.a = 1;
C[2];
C[2] = 42;
var c = new C();
c.foo(1);
