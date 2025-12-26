//// [privateNameStaticFieldCallExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var _this;
        _class_private_field_get(A, _fieldFunc).call(A), null == (_this = _class_private_field_get(A, _fieldFunc)) || _this.call(A), _class_private_field_get(A, _fieldFunc)(), new (_class_private_field_get(A, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        _class_private_field_get(A, _fieldFunc2).call(A, 0, ...arr, 3), new (_class_private_field_get(A, _fieldFunc2))(0, ...arr, 3), _class_private_field_get(A, _fieldFunc2)`head${1}middle${2}tail`, _class_private_field_get(this.getClass(), _fieldFunc2)`test${1}and${2}`;
    }
    getClass() {
        return A;
    }
    constructor(){
        this.x = 1;
    }
}
_fieldFunc.set(A, {
    writable: !0,
    value: function() {
        this.x = 10;
    }
}), _fieldFunc2.set(A, {
    writable: !0,
    value: function(a) {}
});
