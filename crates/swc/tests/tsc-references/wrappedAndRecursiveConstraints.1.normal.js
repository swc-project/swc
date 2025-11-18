//// [wrappedAndRecursiveConstraints.ts]
// no errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(data) {
        _class_call_check(this, C);
        this.data = data;
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        return x;
    };
    return C;
}();
var y = null;
var c = new C(y);
var r = c.foo(y);
