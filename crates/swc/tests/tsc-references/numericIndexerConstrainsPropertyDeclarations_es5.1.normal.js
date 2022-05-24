import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return "";
    };
    C.foo // ok
     = function foo() {};
    _create_class(C, [
        {
            key: "X",
            get: function get() {
                return "";
            },
            set: function set(v) {} // ok
        }
    ], [
        {
            key: "X",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
var a;
// error
var b = {
    a: "",
    b: 1,
    c: function() {},
    "d": "",
    "e": 1,
    1.0: "",
    2.0: 1,
    "3.0": "",
    "4.0": 1,
    f: null,
    get X () {
        return "";
    },
    set X (v){},
    foo: function foo() {
        return "";
    }
};
