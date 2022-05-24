import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
import _class_private_field_destructure from "@swc/helpers/lib/_class_private_field_destructure.js";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap(), Test = function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test), _class_private_field_init(this, _value, {
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
    return Test.prototype.m = function() {
        var ref, _tmp, ref1, _tmp1, foo = {
            bar: 1
        };
        console.log(_class_private_field_get(this, _value)), _class_private_field_set(this, _value, {
            foo: foo
        }), _class_private_field_set(this, _value, {
            foo: foo
        }), _class_private_field_get(this, _value).foo = foo, ref = {
            o: {
                foo: foo
            }
        }, _class_private_field_destructure(this, _value).value = ref.o, _tmp = {
            foo: foo
        }, _class_private_field_destructure(this, _value).value = _extends({}, _tmp), ref1 = {
            foo: foo
        }, _class_private_field_get(this, _value).foo = ref1.foo, _tmp1 = {
            foo: foo
        }, _class_private_field_get(this, _value).foo = _extends({}, _tmp1.foo), _tmp1.foo, _class_private_field_get(this, _value), _class_private_field_destructure(this, _valueOne).value = 1, _class_private_field_destructure(this, _valueRest).value = [
            2,
            3
        ], [
            _class_private_field_get(this, _valueOne)
        ].concat(_to_consumable_array(_class_private_field_get(this, _valueRest))), _class_private_field_set(this, _valueCompound, _class_private_field_get(this, _valueCompound) + 3);
    }, Test;
}();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
