//// [privateNameMethodCallExpression.ts]
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _method = /*#__PURE__*/ new WeakSet(), _method2 = /*#__PURE__*/ new WeakSet();
class AA {
    test() {
        var _this_getInstance, _this_getInstance1, _this_getInstance2, _this_getInstance3;
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
        _class_private_method_get(_this_getInstance = this.getInstance(), _method2, method2).bind(_this_getInstance)`test${1}and${2}`;
        _class_private_method_get(_this_getInstance1 = this.getInstance(), _method2, method2).call(_this_getInstance1, 0, ...arr, 3);
        const b2 = new (_class_private_method_get(_this_getInstance2 = this.getInstance(), _method2, method2))(0, ...arr, 3); //Error 
        const str2 = _class_private_method_get(_this_getInstance3 = this.getInstance(), _method2, method2).bind(_this_getInstance3)`head${1}middle${2}tail`;
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
