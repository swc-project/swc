//// [privateNameStaticFieldCallExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var _A, _A1;
        var _this;
        _A = A, _class_private_field_get(_A, _fieldFunc).call(_A);
        (_this = _class_private_field_get(A, _fieldFunc)) === null || _this === void 0 ? void 0 : _this.call(A);
        const func = _class_private_field_get(A, _fieldFunc);
        func();
        new (_class_private_field_get(A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _A1 = A, _class_private_field_get(_A1, _fieldFunc2).call(_A1, 0, ...arr, 3);
        const b = new (_class_private_field_get(A, _fieldFunc2))(0, ...arr, 3);
        const str = _class_private_field_get(A, _fieldFunc2)`head${1}middle${2}tail`;
        _class_private_field_get(this.getClass(), _fieldFunc2)`test${1}and${2}`;
    }
    getClass() {
        return A;
    }
    constructor(){
        this.x = 1;
    }
}
_fieldFunc.set(A, {
    writable: true,
    value: function() {
        this.x = 10;
    }
});
_fieldFunc2.set(A, {
    writable: true,
    value: function(a, ...b) {}
});
