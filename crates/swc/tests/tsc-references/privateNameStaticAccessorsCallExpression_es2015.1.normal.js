import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
// @target: es2015
class A {
    static test() {
        _class_static_private_field_spec_get(this, A, _fieldFunc).call(A);
        const func = _class_static_private_field_spec_get(this, A, _fieldFunc);
        func();
        new (_class_static_private_field_spec_get(this, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _class_static_private_field_spec_get(this, A, _fieldFunc2).call(A, 0, ...arr, 3);
        const b = new (_class_static_private_field_spec_get(this, A, _fieldFunc2))(0, ...arr, 3);
        const str = _class_static_private_field_spec_get(this, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`;
        _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _fieldFunc = {
    get: get_fieldFunc,
    set: void 0
};
var _fieldFunc2 = {
    get: get_fieldFunc2,
    set: void 0
};
var _x = {
    writable: true,
    value: 1
};
function get_fieldFunc() {
    return function() {
        _class_static_private_field_spec_set(A, A, _x, 10);
    };
}
function get_fieldFunc2() {
    return function(a, ...b) {};
}
