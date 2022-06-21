import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @declaration: true
function f() {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
            this.baz = 1;
        }
        var _proto = C.prototype;
        _proto.bar = function bar() {};
        C.foo = function foo() {};
        return C;
    }();
}
