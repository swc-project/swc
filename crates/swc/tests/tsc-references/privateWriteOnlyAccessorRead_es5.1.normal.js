import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
var _value = /*#__PURE__*/ new WeakMap(), _valueRest = /*#__PURE__*/ new WeakMap(), _valueOne = /*#__PURE__*/ new WeakMap(), _valueCompound = /*#__PURE__*/ new WeakMap();
// @target: es2015
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
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
    var _proto = Test.prototype;
    _proto.m = function m() {
        var foo = {
            bar: 1
        };
        console.log(_class_private_field_get(this, _value)); // error
        _class_private_field_set(this, _value, {
            foo: foo
        }); // ok
        _class_private_field_set(this, _value, {
            foo: foo
        }); // ok
        _class_private_field_get(this, _value).foo = foo; // error
        var ref;
        ref = {
            o: {
                foo: foo
            }
        }, _class_private_field_destructure(this, _value).value = ref.o, ref; //ok
        var _tmp;
        _tmp = {
            foo: foo
        }, _class_private_field_destructure(this, _value).value = _extends({}, _tmp), _tmp; //ok
        var ref1;
        ref1 = {
            foo: foo
        }, _class_private_field_get(this, _value).foo = ref1.foo, ref1; //error
        var _tmp1;
        var ref2, ref3;
        _tmp1 = {
            foo: foo
        }, _class_private_field_get(this, _value).foo = _extends({}, _tmp1.foo), ref2 = _tmp1, ref3 = ref2.foo, ref3, ref2, _tmp1; //error
        var r = {
            o: _class_private_field_get(this, _value)
        }; //error
        _class_private_field_destructure(this, _valueOne).value = 1, _class_private_field_destructure(this, _valueRest).value = [
            2,
            3
        ];
        var arr = [
            _class_private_field_get(this, _valueOne)
        ].concat(_to_consumable_array(_class_private_field_get(this, _valueRest)));
        _class_private_field_set(this, _valueCompound, _class_private_field_get(this, _valueCompound) + 3);
    };
    return Test;
}();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
