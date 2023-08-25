//// [privateNameComputedPropertyName3.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _name = /*#__PURE__*/ new WeakMap();
console.log(new class {
    getValue(x) {
        var _y = /*#__PURE__*/ new WeakMap();
        let _class_private_field_get1 = _class_private_field_get(this, _name);
        return new class {
            [_class_private_field_get1]() {
                return x + _class_private_field_get(this, _y);
            }
            constructor(){
                _class_private_field_init(this, _y, {
                    writable: !0,
                    value: void 0
                }), _class_private_field_set(this, _y, 100);
            }
        }()[_class_private_field_get(this, _name)]();
    }
    constructor(name){
        _class_private_field_init(this, _name, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _name, name);
    }
}("NAME").getValue(100));
