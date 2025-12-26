//// [privateNameStaticAccessors.ts]
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _prop = new WeakMap(), _roProp = new WeakMap();
class A1 {
    constructor(name){
        var _A1, _A11, _A12;
        _A1 = A1, _prop.get(_A1).set.call(_A1, "");
        _class_private_field_set(A1, _roProp, ""); // Error
        console.log((_A11 = A1, _prop.get(_A11).get.call(_A11)));
        console.log((_A12 = A1, _roProp.get(_A12).get.call(_A12)));
    }
}
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
_prop.set(A1, {
    get: get_prop,
    set: set_prop
});
_roProp.set(A1, {
    get: get_roProp,
    set: void 0
});
