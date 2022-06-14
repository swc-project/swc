import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _method = new WeakSet(), _method2 = new WeakSet();
class AA {
    test() {
        var _ref, _ref1, _ref2;
        _class_private_method_get(this, _method, method).call(this);
        let func = _class_private_method_get(this, _method, method);
        func(), new (_class_private_method_get(this, _method, method))();
        let arr = [
            1,
            2
        ];
        _class_private_method_get(this, _method2, method2).call(this, 0, ...arr, 3), new (_class_private_method_get(this, _method2, method2))(0, ...arr, 3), _class_private_method_get(this, _method2, method2).bind(this)`head${1}middle${2}tail`, _class_private_method_get(_ref = this.getInstance(), _method2, method2).bind(_ref)`test${1}and${2}`, _class_private_method_get(_ref1 = this.getInstance(), _method2, method2).call(_ref1, 0, ...arr, 3), new (_class_private_method_get(this.getInstance(), _method2, method2))(0, ...arr, 3), _class_private_method_get(_ref2 = this.getInstance(), _method2, method2).bind(_ref2)`head${1}middle${2}tail`;
    }
    getInstance() {
        return new AA();
    }
    constructor(){
        _class_private_method_init(this, _method), _class_private_method_init(this, _method2), this.x = 1;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
