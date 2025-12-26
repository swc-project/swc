//// [privateNameAccessors.ts]
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _prop = new WeakMap(), _roProp = new WeakMap();
class A1 {
    constructor(name){
        var _this, _this1, _this2;
        _prop.set(this, {
            get: get_prop,
            set: set_prop
        });
        _roProp.set(this, {
            get: get_roProp,
            set: void 0
        });
        _this = this, _prop.get(_this).set.call(_this, "");
        _class_private_field_set(this, _roProp, ""); // Error
        console.log((_this1 = this, _prop.get(_this1).get.call(_this1)));
        console.log((_this2 = this, _roProp.get(_this2).get.call(_this2)));
    }
}
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
