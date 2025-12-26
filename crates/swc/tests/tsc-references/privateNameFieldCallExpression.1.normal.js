//// [privateNameFieldCallExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _fieldFunc = /*#__PURE__*/ new WeakMap(), _fieldFunc2 = /*#__PURE__*/ new WeakMap();
class A {
    test() {
        var _this, _this1, _ref, _this_getInstance;
        _class_private_field_get(this, _fieldFunc).call(this);
        (_this = _class_private_field_get(_ref = _this1 = this, _fieldFunc)) === null || _this === void 0 ? void 0 : _this.call(_this1);
        const func = _class_private_field_get(this, _fieldFunc);
        func();
        new (_class_private_field_get(this, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _class_private_field_get(this, _fieldFunc2).call(this, 0, ...arr, 3);
        const b = new (_class_private_field_get(this, _fieldFunc2))(0, ...arr, 3);
        const str = _class_private_field_get(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`;
        _class_private_field_get(_this_getInstance = this.getInstance(), _fieldFunc2).bind(_this_getInstance)`test${1}and${2}`;
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
