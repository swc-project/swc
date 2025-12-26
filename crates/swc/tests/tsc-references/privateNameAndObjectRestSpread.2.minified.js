//// [privateNameAndObjectRestSpread.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
var _prop = new WeakMap(), _propStatic = new WeakMap();
class C {
    method(other) {
        _class_private_field_get(_object_spread({}, other), _prop);
        let {} = other;
        _class_private_field_get(_extends({}, other), _prop), _class_private_field_get(_object_spread({}, C), _propStatic);
        let {} = C;
        _class_private_field_get(_extends({}, C), _propStatic);
    }
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _prop, 1);
    }
}
_propStatic.set(C, {
    writable: !0,
    value: 1
});
