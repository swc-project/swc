//// [privateWriteOnlyAccessorRead.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _extends } from "@swc/helpers/_/_extends";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new class {
    m() {
        var _ref2;
        let foo = {
            bar: 1
        };
        console.log(_class_private_field_get(this, _value)), _value.get(this).set.call(this, {
            foo
        }), _value.get(this).set.call(this, {
            foo
        }), _class_private_field_get(this, _value).foo = foo, ({ o: _class_private_field_get(this, _value) } = {
            o: {
                foo
            }
        }), _value.get(this).set.call(this, _extends({}, {
            foo
        })), ({ foo: _class_private_field_get(this, _value).foo } = {
            foo
        }), ({ foo: _ref2 } = {
            foo
        }), _class_private_field_get(this, _value).foo = _extends({}, _ref2), _class_private_field_get(this, _value), [_class_private_field_get(this, _valueOne), ..._class_private_field_get(this, _valueRest)] = [
            1,
            2,
            3
        ], [
            _class_private_field_get(this, _valueOne),
            ..._class_private_field_get(this, _valueRest)
        ], _valueCompound.get(this).set.call(this, _class_private_field_get(this, _valueCompound) + 3);
    }
    constructor(){
        _value.set(this, {
            get: void 0,
            set: set_value
        }), _valueRest.set(this, {
            get: void 0,
            set: set_valueRest
        }), _valueOne.set(this, {
            get: void 0,
            set: set_valueOne
        }), _valueCompound.set(this, {
            get: void 0,
            set: set_valueCompound
        });
    }
}().m();
