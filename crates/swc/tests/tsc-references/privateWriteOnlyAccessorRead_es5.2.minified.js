import * as swcHelpers from "@swc/helpers";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap(), Test = function() {
    "use strict";
    function Test() {
        swcHelpers.classCallCheck(this, Test), swcHelpers.classPrivateFieldInit(this, _value, {
            get: void 0,
            set: set_value
        }), swcHelpers.classPrivateFieldInit(this, _valueRest, {
            get: void 0,
            set: set_valueRest
        }), swcHelpers.classPrivateFieldInit(this, _valueOne, {
            get: void 0,
            set: set_valueOne
        }), swcHelpers.classPrivateFieldInit(this, _valueCompound, {
            get: void 0,
            set: set_valueCompound
        });
    }
    return Test.prototype.m = function() {
        var ref, _tmp, ref1, _tmp1, foo = {
            bar: 1
        };
        console.log(swcHelpers.classPrivateFieldGet(this, _value)), swcHelpers.classPrivateFieldSet(this, _value, {
            foo: foo
        }), swcHelpers.classPrivateFieldSet(this, _value, {
            foo: foo
        }), swcHelpers.classPrivateFieldGet(this, _value).foo = foo, ref = {
            o: {
                foo: foo
            }
        }, swcHelpers.classPrivateFieldDestructureSet(this, _value).value = ref.o, _tmp = {
            foo: foo
        }, swcHelpers.classPrivateFieldDestructureSet(this, _value).value = swcHelpers.extends({}, _tmp), ref1 = {
            foo: foo
        }, swcHelpers.classPrivateFieldGet(this, _value).foo = ref1.foo, _tmp1 = {
            foo: foo
        }, swcHelpers.classPrivateFieldGet(this, _value).foo = swcHelpers.extends({}, _tmp1.foo), _tmp1.foo, swcHelpers.classPrivateFieldGet(this, _value), swcHelpers.classPrivateFieldDestructureSet(this, _valueOne).value = 1, swcHelpers.classPrivateFieldDestructureSet(this, _valueRest).value = [
            2,
            3
        ], [
            swcHelpers.classPrivateFieldGet(this, _valueOne)
        ].concat(swcHelpers.toConsumableArray(swcHelpers.classPrivateFieldGet(this, _valueRest))), swcHelpers.classPrivateFieldSet(this, _valueCompound, swcHelpers.classPrivateFieldGet(this, _valueCompound) + 3);
    }, Test;
}();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
