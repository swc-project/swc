import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _name = new WeakMap();
console.log(new class {
    getValue(x) {
        var _y = new WeakMap();
        let tmp = _class_private_field_get(this, _name);
        return new class {
            [tmp]() {
                return x + _class_private_field_get(this, _y);
            }
            constructor(){
                _class_private_field_init(this, _y, {
                    writable: !0,
                    value: 100
                });
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
