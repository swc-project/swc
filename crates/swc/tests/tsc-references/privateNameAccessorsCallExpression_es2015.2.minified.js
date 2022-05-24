import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var _ref;
        _class_private_field_get(this, _fieldFunc).call(this);
        let func = _class_private_field_get(this, _fieldFunc);
        func(), new (_class_private_field_get(this, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        _class_private_field_get(this, _fieldFunc2).call(this, 0, ...arr, 3), new (_class_private_field_get(this, _fieldFunc2))(0, ...arr, 3), _class_private_field_get(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`, _class_private_field_get(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _class_private_field_init(this, _fieldFunc, {
            get: function() {
                return function() {
                    this.x = 10;
                };
            },
            set: void 0
        }), _class_private_field_init(this, _fieldFunc2, {
            get: function() {
                return function(a, ...b) {};
            },
            set: void 0
        }), this.x = 1;
    }
}
