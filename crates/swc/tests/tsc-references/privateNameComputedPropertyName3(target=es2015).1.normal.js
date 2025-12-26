//// [privateNameComputedPropertyName3.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _name = new WeakMap();
class Foo {
    getValue(x) {
        var _y = new WeakMap();
        let _tmp = _class_private_field_get(obj, _name);
        const obj = this;
        class Bar {
            [_tmp]() {
                return x + _class_private_field_get(this, _y);
            }
            constructor(){
                _class_private_field_init(this, _y, {
                    writable: true,
                    value: void 0
                });
                _class_private_field_set(this, _y, 100);
            }
        }
        return new Bar()[_class_private_field_get(obj, _name)]();
    }
    constructor(name){
        _class_private_field_init(this, _name, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _name, name);
    }
}
console.log(new Foo("NAME").getValue(100));
