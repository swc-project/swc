import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _method = /*#__PURE__*/ new WeakSet(), _method2 = /*#__PURE__*/ new WeakSet();
// @target: es2015
class AA {
    test() {
        var _ref, _ref1, _ref2, _ref3;
        _class_private_method_get(this, _method, method).call(this);
        const func = _class_private_method_get(this, _method, method);
        func();
        new (_class_private_method_get(this, _method, method))();
        const arr = [
            1,
            2
        ];
        _class_private_method_get(this, _method2, method2).call(this, 0, ...arr, 3);
        const b = new (_class_private_method_get(this, _method2, method2))(0, ...arr, 3); //Error 
        const str = _class_private_method_get(this, _method2, method2).bind(this)`head${1}middle${2}tail`;
        _class_private_method_get(_ref = this.getInstance(), _method2, method2).bind(_ref)`test${1}and${2}`;
        _class_private_method_get(_ref1 = this.getInstance(), _method2, method2).call(_ref1, 0, ...arr, 3);
        const b2 = new (_class_private_method_get(_ref2 = this.getInstance(), _method2, method2))(0, ...arr, 3); //Error 
        const str2 = _class_private_method_get(_ref3 = this.getInstance(), _method2, method2).bind(_ref3)`head${1}middle${2}tail`;
    }
    getInstance() {
        return new AA();
    }
    constructor(){
        _class_private_method_init(this, _method);
        _class_private_method_init(this, _method2);
        this.x = 1;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
