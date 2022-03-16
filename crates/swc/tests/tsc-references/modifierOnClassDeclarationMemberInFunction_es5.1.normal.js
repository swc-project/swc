import * as swcHelpers from "@swc/helpers";
// @declaration: true
function f() {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            swcHelpers.classCallCheck(this, C);
            this.baz = 1;
        }
        var _proto = C.prototype;
        _proto.bar = function bar() {};
        C.foo = function foo() {};
        return C;
    }();
}
