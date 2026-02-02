//// [test.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f(x) {}
f(); // Always been ok
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.p = function(x) {};
    }
    var _proto = C.prototype;
    _proto.m = function m(x) {};
    C.m = function m(x) {};
    return C;
}();
C.m(); // Always been ok
new C().m(); // Regression #39261
new C().p(); // Regression #39261
var obj = {
    m: function m(x) {},
    p: function p(x) {}
};
obj.m(); // Always been ok
obj.p(); // Always been ok
