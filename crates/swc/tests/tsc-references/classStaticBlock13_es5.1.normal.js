import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return _class_static_private_field_spec_get(C, C, _x);
    };
    return C;
}();
var _x = {
    writable: true,
    value: 123
};
var __ = {
    writable: true,
    value: function() {
        console.log(_class_static_private_field_spec_get(C, C, _x));
    }()
};
