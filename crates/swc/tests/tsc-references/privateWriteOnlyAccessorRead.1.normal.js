//// [privateWriteOnlyAccessorRead.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _write_only_error } from "@swc/helpers/_/_write_only_error";
import { _ as _class_private_field_destructure } from "@swc/helpers/_/_class_private_field_destructure";
var _value = /*#__PURE__*/ new WeakMap(), _valueRest = /*#__PURE__*/ new WeakMap(), _valueOne = /*#__PURE__*/ new WeakMap(), _valueCompound = /*#__PURE__*/ new WeakMap();
class Test {
    m() {
        var _ref, _ref1, _ref2;
        const foo = {
            bar: 1
        };
        console.log((this, _write_only_error("#value"))); // error
        _class_private_field_set(this, _value, {
            foo
        }); // ok
        _class_private_field_set(this, _value, {
            foo
        }); // ok
        (this, _write_only_error("#value")).foo = foo; // error
        ({ o: _class_private_field_destructure(this, _value).value } = {
            o: {
                foo
            }
        }); //ok
        _ref = {
            foo
        }, ({} = _ref), _class_private_field_destructure(this, _value).value = _extends({}, _ref), _ref; //ok
        ({ foo: (this, _write_only_error("#value")).foo } = {
            foo
        }); //error
        _ref1 = {
            foo
        }, ({ foo: _ref2 } = _ref1), ({} = _ref2), (this, _write_only_error("#value")).foo = _extends({}, _ref2), _ref1; //error
        let r = {
            o: (this, _write_only_error("#value"))
        }; //error
        [_class_private_field_destructure(this, _valueOne).value, ..._class_private_field_destructure(this, _valueRest).value] = [
            1,
            2,
            3
        ];
        let arr = [
            (this, _write_only_error("#valueOne")),
            ...(this, _write_only_error("#valueRest"))
        ];
        _class_private_field_set(this, _valueCompound, (this, _write_only_error("#valueCompound")) + 3);
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
