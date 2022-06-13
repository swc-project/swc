import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _fieldFunc = /*#__PURE__*/ new WeakMap(), _fieldFunc2 = /*#__PURE__*/ new WeakMap();
// @target: es2015
class A {
    test() {
        var ref;
        var _ref;
        _class_private_field_get(this, _fieldFunc).call(this);
        (ref = _class_private_field_get(this, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(this);
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
        _class_private_field_get(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _class_private_field_init(this, _fieldFunc, {
            writable: true,
            value: function() {
                this.x = 10;
            }
        });
        _class_private_field_init(this, _fieldFunc2, {
            writable: true,
            value: function(a, ...b) {}
        });
        this.x = 1;
    }
}
