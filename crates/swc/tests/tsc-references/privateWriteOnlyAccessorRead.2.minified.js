//// [privateWriteOnlyAccessorRead.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _write_only_error from "@swc/helpers/src/_write_only_error.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new class {
    m() {
        let foo = {
            bar: 1
        };
        console.log(_write_only_error("#value")), _class_private_field_set(this, _value, {
            foo
        }), _class_private_field_set(this, _value, {
            foo
        }), _write_only_error("#value").foo = foo, ({ o: _class_private_field_destructure(this, _value).value  } = {
            o: {
                foo
            }
        }), _class_private_field_destructure(this, _value).value = _extends({}, {
            foo
        }), ({ foo: _write_only_error("#value").foo  } = {
            foo
        }), _write_only_error("#value").foo = _extends({}, {
            foo
        }.foo), _write_only_error("#value"), [_class_private_field_destructure(this, _valueOne).value, ..._class_private_field_destructure(this, _valueRest).value] = [
            1,
            2,
            3
        ], [
            _write_only_error("#valueOne"),
            ..._write_only_error("#valueRest")
        ], _class_private_field_set(this, _valueCompound, _write_only_error("#valueCompound") + 3);
    }
    constructor(){
        _class_private_field_init(this, _value, {
            get: void 0,
            set: set_value
        }), _class_private_field_init(this, _valueRest, {
            get: void 0,
            set: set_valueRest
        }), _class_private_field_init(this, _valueOne, {
            get: void 0,
            set: set_valueOne
        }), _class_private_field_init(this, _valueCompound, {
            get: void 0,
            set: set_valueCompound
        });
    }
}().m();
