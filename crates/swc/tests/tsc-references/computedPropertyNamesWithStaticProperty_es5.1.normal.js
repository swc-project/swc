// @target: es6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_name_tdz_error from "@swc/helpers/src/_class_name_tdz_error.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var _staticProp = (_class_name_tdz_error("C"), C).staticProp, _staticProp1 = (_class_name_tdz_error("C"), C).staticProp, _staticProp2 = (_class_name_tdz_error("C"), C).staticProp;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[_staticProp2] = function() {};
    _create_class(C, [
        {
            key: _staticProp,
            get: function get() {
                return "hello";
            }
        },
        {
            key: _staticProp1,
            set: function set(x) {
                var y = x;
            }
        }
    ]);
    return C;
}();
C.staticProp = 10;
