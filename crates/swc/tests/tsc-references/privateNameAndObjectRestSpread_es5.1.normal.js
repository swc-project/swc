import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var _prop = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        _class_private_field_init(this, _prop, {
            writable: true,
            value: 1
        });
    }
    var _proto = C.prototype;
    _proto.method = function method(other) {
        var obj = _object_spread({}, other);
        _class_private_field_get(obj, _prop);
        var rest = _extends({}, other);
        _class_private_field_get(rest, _prop);
        var statics = _object_spread({}, C);
        _class_static_private_field_spec_get(statics, C, _propStatic);
        var sRest = _extends({}, C);
        _class_static_private_field_spec_get(sRest, C, _propStatic);
    };
    return C;
}();
var _propStatic = {
    writable: true,
    value: 1
};
