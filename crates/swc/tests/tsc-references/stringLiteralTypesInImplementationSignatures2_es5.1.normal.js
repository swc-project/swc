import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
function foo(x) {}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {};
    return C;
}();
var a;
var b = _define_property({
    foo: function foo(x) {}
}, "foo", function foo(x) {});
