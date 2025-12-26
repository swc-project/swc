//// [privateNameAndObjectRestSpread.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
var _prop = new WeakMap(), _propStatic = new WeakMap();
class C {
    method(other) {
        const obj = _object_spread({}, other);
        _class_private_field_get(obj, _prop);
        const {} = other, rest = _extends({}, other);
        _class_private_field_get(rest, _prop);
        const statics = _object_spread({}, C);
        _class_private_field_get(statics, _propStatic);
        const {} = C, sRest = _extends({}, C);
        _class_private_field_get(sRest, _propStatic);
    }
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _prop, 1);
    }
}
_propStatic.set(C, {
    writable: true,
    value: 1
});
