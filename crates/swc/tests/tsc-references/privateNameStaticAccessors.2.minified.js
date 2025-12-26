//// [privateNameStaticAccessors.ts]
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _prop = new WeakMap(), _roProp = new WeakMap();
class A1 {
    constructor(name){
        _prop.get(A1).set.call(A1, ""), _class_private_field_set(A1, _roProp, ""), console.log(_prop.get(A1).get.call(A1)), console.log(_roProp.get(A1).get.call(A1));
    }
}
_prop.set(A1, {
    get: function() {
        return "";
    },
    set: function(param) {}
}), _roProp.set(A1, {
    get: function() {
        return "";
    },
    set: void 0
});
