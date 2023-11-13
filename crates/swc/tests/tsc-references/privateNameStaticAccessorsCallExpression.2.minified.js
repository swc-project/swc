//// [privateNameStaticAccessorsCallExpression.ts]
import { _ as _class_static_private_field_spec_get } from "@swc/helpers/_/_class_static_private_field_spec_get";
import { _ as _class_static_private_field_spec_set } from "@swc/helpers/_/_class_static_private_field_spec_set";
class A {
    static test() {
        _class_static_private_field_spec_get(this, A, _fieldFunc).call(A), _class_static_private_field_spec_get(this, A, _fieldFunc)(), new (_class_static_private_field_spec_get(this, A, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        _class_static_private_field_spec_get(this, A, _fieldFunc2).call(A, 0, ...arr, 3), new (_class_static_private_field_spec_get(this, A, _fieldFunc2))(0, ...arr, 3), _class_static_private_field_spec_get(this, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`, _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _fieldFunc = {
    get: function() {
        return function() {
            _class_static_private_field_spec_set(A, A, _x, 10);
        };
    },
    set: void 0
}, _fieldFunc2 = {
    get: function() {
        return function(a, ...b) {};
    },
    set: void 0
}, _x = {
    writable: !0,
    value: 1
};
