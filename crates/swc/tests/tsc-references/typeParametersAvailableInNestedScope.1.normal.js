//// [typeParametersAvailableInNestedScope.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.x = function(a) {
            var y;
            return y;
        };
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        function temp(a) {
            var y;
            return y;
        }
        return temp(null);
    };
    return C;
}();
var c = new C();
c.data = c.x(null);
c.data = c.foo();
