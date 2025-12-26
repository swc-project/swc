//// [privateNameFieldCallExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var _this, _this1;
        var _this2, _this3;
        _this = this, _class_private_field_get(_this, _fieldFunc).call(_this);
        (_this2 = _class_private_field_get(_this3 = this, _fieldFunc)) === null || _this2 === void 0 ? void 0 : _this2.call(_this3);
        const func = _class_private_field_get(this, _fieldFunc);
        func();
        new (_class_private_field_get(this, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _this1 = this, _class_private_field_get(_this1, _fieldFunc2).call(_this1, 0, ...arr, 3);
        const b = new (_class_private_field_get(this, _fieldFunc2))(0, ...arr, 3);
        const str = _class_private_field_get(this, _fieldFunc2)`head${1}middle${2}tail`;
        _class_private_field_get(this.getInstance(), _fieldFunc2)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _class_private_field_init(this, _fieldFunc, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _fieldFunc2, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _fieldFunc, function() {
            this.x = 10;
        });
        _class_private_field_set(this, _fieldFunc2, function(a, ...b) {});
        this.x = 1;
    }
}
