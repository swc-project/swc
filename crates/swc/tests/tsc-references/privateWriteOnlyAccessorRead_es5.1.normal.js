import * as swcHelpers from "@swc/helpers";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
var Test = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function Test() {
        swcHelpers.classCallCheck(this, Test);
        swcHelpers.classPrivateFieldInit(this, _value, {
            get: void 0,
            set: set_value
        });
        swcHelpers.classPrivateFieldInit(this, _valueRest, {
            get: void 0,
            set: set_valueRest
        });
        swcHelpers.classPrivateFieldInit(this, _valueOne, {
            get: void 0,
            set: set_valueOne
        });
        swcHelpers.classPrivateFieldInit(this, _valueCompound, {
            get: void 0,
            set: set_valueCompound
        });
    }
    var _proto = Test.prototype;
    _proto.m = function m() {
        var foo = {
            bar: 1
        };
        console.log(swcHelpers.classPrivateFieldGet(this, _value)); // error
        swcHelpers.classPrivateFieldSet(this, _value, {
            foo: foo
        }); // ok
        swcHelpers.classPrivateFieldSet(this, _value, {
            foo: foo
        }); // ok
        swcHelpers.classPrivateFieldGet(this, _value).foo = foo; // error
        var ref;
        ref = {
            o: {
                foo: foo
            }
        }, swcHelpers.classPrivateFieldDestructureSet(this, _value).value = ref.o, ref; //ok
        var _tmp;
        _tmp = {
            foo: foo
        }, swcHelpers.classPrivateFieldDestructureSet(this, _value).value = swcHelpers.extends({}, _tmp), _tmp; //ok
        var ref1;
        ref1 = {
            foo: foo
        }, swcHelpers.classPrivateFieldGet(this, _value).foo = ref1.foo, ref1; //error
        var _tmp1;
        var ref2, ref3;
        _tmp1 = {
            foo: foo
        }, swcHelpers.classPrivateFieldGet(this, _value).foo = swcHelpers.extends({}, _tmp1.foo), ref2 = _tmp1, ref3 = ref2.foo, ref3, ref2, _tmp1; //error
        var r = {
            o: swcHelpers.classPrivateFieldGet(this, _value)
        }; //error
        swcHelpers.classPrivateFieldDestructureSet(this, _valueOne).value = 1, swcHelpers.classPrivateFieldDestructureSet(this, _valueRest).value = [
            2,
            3
        ];
        var arr = [
            swcHelpers.classPrivateFieldGet(this, _valueOne)
        ].concat(swcHelpers.toConsumableArray(swcHelpers.classPrivateFieldGet(this, _valueRest)));
        swcHelpers.classPrivateFieldSet(this, _valueCompound, swcHelpers.classPrivateFieldGet(this, _valueCompound) + 3);
    };
    return Test;
}();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
