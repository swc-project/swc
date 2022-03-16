import * as swcHelpers from "@swc/helpers";
var _value = /*#__PURE__*/ new WeakMap(), _valueRest = /*#__PURE__*/ new WeakMap(), _valueOne = /*#__PURE__*/ new WeakMap(), _valueCompound = /*#__PURE__*/ new WeakMap();
// @target: es2015
class Test {
    m() {
        const foo = {
            bar: 1
        };
        console.log(swcHelpers.classPrivateFieldGet(this, _value)); // error
        swcHelpers.classPrivateFieldSet(this, _value, {
            foo
        }); // ok
        swcHelpers.classPrivateFieldSet(this, _value, {
            foo
        }); // ok
        swcHelpers.classPrivateFieldGet(this, _value).foo = foo; // error
        ({ o: swcHelpers.classPrivateFieldDestructureSet(this, _value).value  } = {
            o: {
                foo
            }
        }); //ok
        var _tmp;
        _tmp = {
            foo
        }, swcHelpers.classPrivateFieldDestructureSet(this, _value).value = swcHelpers.extends({}, _tmp), _tmp; //ok
        ({ foo: swcHelpers.classPrivateFieldGet(this, _value).foo  } = {
            foo
        }); //error
        var _tmp1;
        _tmp1 = {
            foo
        }, swcHelpers.classPrivateFieldGet(this, _value).foo = swcHelpers.extends({}, _tmp1.foo), ({ foo: {} ,  } = _tmp1), _tmp1; //error
        let r = {
            o: swcHelpers.classPrivateFieldGet(this, _value)
        }; //error
        [swcHelpers.classPrivateFieldDestructureSet(this, _valueOne).value, ...swcHelpers.classPrivateFieldDestructureSet(this, _valueRest).value] = [
            1,
            2,
            3
        ];
        let arr = [
            swcHelpers.classPrivateFieldGet(this, _valueOne),
            ...swcHelpers.classPrivateFieldGet(this, _valueRest)
        ];
        swcHelpers.classPrivateFieldSet(this, _valueCompound, swcHelpers.classPrivateFieldGet(this, _valueCompound) + 3);
    }
    constructor(){
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
}
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
