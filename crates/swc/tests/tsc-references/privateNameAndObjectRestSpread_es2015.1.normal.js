import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var _prop = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
class C {
    method(other) {
        const obj = _object_spread({}, other);
        _class_private_field_get(obj, _prop);
        const rest = _extends({}, other);
        _class_private_field_get(rest, _prop);
        const statics = _object_spread({}, C);
        _class_static_private_field_spec_get(statics, C, _propStatic);
        const sRest = _extends({}, C);
        _class_static_private_field_spec_get(sRest, C, _propStatic);
    }
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: true,
            value: 1
        });
    }
}
var _propStatic = {
    writable: true,
    value: 1
};
