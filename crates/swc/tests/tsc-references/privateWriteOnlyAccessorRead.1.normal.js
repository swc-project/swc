//// [privateWriteOnlyAccessorRead.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _extends } from "@swc/helpers/_/_extends";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
class Test {
    m() {
        var _this, _this1, _this2, _this3;
        var _ref, _ref1, _ref2;
        const foo = {
            bar: 1
        };
        console.log(_class_private_field_get(this, _value)); // error
        _this = this, _value.get(_this).set.call(_this, {
            foo
        }); // ok
        _this1 = this, _value.get(_this1).set.call(_this1, {
            foo
        }); // ok
        _class_private_field_get(this, _value).foo = foo; // error
        ({ o: _class_private_field_get(this, _value) } = {
            o: {
                foo
            }
        }); //ok
        _ref = {
            foo
        }, ({} = _ref), _this2 = this, _value.get(_this2).set.call(_this2, _extends({}, _ref)), _ref; //ok
        ({ foo: _class_private_field_get(this, _value).foo } = {
            foo
        }); //error
        _ref1 = {
            foo
        }, ({ foo: _ref2 } = _ref1), ({} = _ref2), _class_private_field_get(this, _value).foo = _extends({}, _ref2), _ref1; //error
        let r = {
            o: _class_private_field_get(this, _value)
        }; //error
        [_class_private_field_get(this, _valueOne), ..._class_private_field_get(this, _valueRest)] = [
            1,
            2,
            3
        ];
        let arr = [
            _class_private_field_get(this, _valueOne),
            ..._class_private_field_get(this, _valueRest)
        ];
        _this3 = this, _valueCompound.get(_this3).set.call(_this3, _class_private_field_get(_this3, _valueCompound) + 3);
    }
    constructor(){
        _value.set(this, {
            get: void 0,
            set: set_value
        });
        _valueRest.set(this, {
            get: void 0,
            set: set_valueRest
        });
        _valueOne.set(this, {
            get: void 0,
            set: set_valueOne
        });
        _valueCompound.set(this, {
            get: void 0,
            set: set_valueCompound
        });
    }
}
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
