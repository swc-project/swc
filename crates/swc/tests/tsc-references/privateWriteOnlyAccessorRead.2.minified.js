//// [privateWriteOnlyAccessorRead.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _write_only_error } from "@swc/helpers/_/_write_only_error";
import { _ as _class_private_field_destructure } from "@swc/helpers/_/_class_private_field_destructure";
var _value = /*#__PURE__*/ new WeakMap(), _valueRest = /*#__PURE__*/ new WeakMap(), _valueOne = /*#__PURE__*/ new WeakMap(), _valueCompound = /*#__PURE__*/ new WeakMap();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new class {
    m() {
        var _tmp, _tmp1;
        let foo = {
            bar: 1
        };
        console.log(_write_only_error("#value")), _class_private_field_set(this, _value, {
            foo
        }), _class_private_field_set(this, _value, {
            foo
        }), _write_only_error("#value").foo = foo, ({ o: _class_private_field_destructure(this, _value).value } = {
            o: {
                foo
            }
        }), _tmp = {
            foo
        }, _class_private_field_destructure(this, _value).value = _extends({}, _object_destructuring_empty(_tmp)), ({ foo: _write_only_error("#value").foo } = {
            foo
        }), _tmp1 = {
            foo
        }, _write_only_error("#value").foo = _extends({}, _object_destructuring_empty(_tmp1.foo)), _write_only_error("#value"), [_class_private_field_destructure(this, _valueOne).value, ..._class_private_field_destructure(this, _valueRest).value] = [
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
