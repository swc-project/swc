import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "x",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    _create_class(D, [
        {
            key: "x",
            set: function set(v) {} // error
        }
    ]);
    return D;
}();
var E = /*#__PURE__*/ function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    _create_class(E, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return E;
}();
