import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
var _value = /*#__PURE__*/ new WeakMap(), _valueRest = /*#__PURE__*/ new WeakMap(), _valueOne = /*#__PURE__*/ new WeakMap(), _valueCompound = /*#__PURE__*/ new WeakMap();
// @target: es2015
class Test {
    m() {
        const foo = {
            bar: 1
        };
        console.log(_class_private_field_get(this, _value)); // error
        _class_private_field_set(this, _value, {
            foo
        }); // ok
        _class_private_field_set(this, _value, {
            foo
        }); // ok
        _class_private_field_get(this, _value).foo = foo; // error
        ({ o: _class_private_field_destructure(this, _value).value  } = {
            o: {
                foo
            }
        }); //ok
        var _tmp;
        _tmp = {
            foo
        }, _class_private_field_destructure(this, _value).value = _extends({}, _tmp), _tmp; //ok
        ({ foo: _class_private_field_get(this, _value).foo  } = {
            foo
        }); //error
        var _tmp1;
        _tmp1 = {
            foo
        }, _class_private_field_get(this, _value).foo = _extends({}, _tmp1.foo), ({ foo: {} ,  } = _tmp1), _tmp1; //error
        let r = {
            o: _class_private_field_get(this, _value)
        }; //error
        [_class_private_field_destructure(this, _valueOne).value, ..._class_private_field_destructure(this, _valueRest).value] = [
            1,
            2,
            3
        ];
        let arr = [
            _class_private_field_get(this, _valueOne),
            ..._class_private_field_get(this, _valueRest)
        ];
        _class_private_field_set(this, _valueCompound, _class_private_field_get(this, _valueCompound) + 3);
    }
    constructor(){
        _class_private_field_init(this, _value, {
            get: void 0,
            set: set_value
        });
        _class_private_field_init(this, _valueRest, {
            get: void 0,
            set: set_valueRest
        });
        _class_private_field_init(this, _valueOne, {
            get: void 0,
            set: set_valueOne
        });
        _class_private_field_init(this, _valueCompound, {
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
