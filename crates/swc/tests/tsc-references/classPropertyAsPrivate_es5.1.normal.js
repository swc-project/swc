import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    C.foo = function foo() {};
    _create_class(C, [
        {
            key: "y",
            get: function get() {
                return null;
            },
            set: function set(x) {}
        }
    ], [
        {
            key: "b",
            get: function get() {
                return null;
            },
            set: function set(x) {}
        }
    ]);
    return C;
}();
var c;
// all errors
c.x;
c.y;
c.y = 1;
c.foo();
C.a;
C.b();
C.b = 1;
C.foo();
