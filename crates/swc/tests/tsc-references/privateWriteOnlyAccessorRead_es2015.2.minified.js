import * as swcHelpers from "@swc/helpers";
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
new class {
    m() {
        var _tmp, _tmp1;
        let foo = {
            bar: 1
        };
        console.log(swcHelpers.classPrivateFieldGet(this, _value)), swcHelpers.classPrivateFieldSet(this, _value, {
            foo
        }), swcHelpers.classPrivateFieldSet(this, _value, {
            foo
        }), swcHelpers.classPrivateFieldGet(this, _value).foo = foo, ({ o: swcHelpers.classPrivateFieldDestructureSet(this, _value).value  } = {
            o: {
                foo
            }
        }), _tmp = {
            foo
        }, swcHelpers.classPrivateFieldDestructureSet(this, _value).value = swcHelpers.extends({}, _tmp), ({ foo: swcHelpers.classPrivateFieldGet(this, _value).foo  } = {
            foo
        }), _tmp1 = {
            foo
        }, swcHelpers.classPrivateFieldGet(this, _value).foo = swcHelpers.extends({}, _tmp1.foo), swcHelpers.classPrivateFieldGet(this, _value), [swcHelpers.classPrivateFieldDestructureSet(this, _valueOne).value, ...swcHelpers.classPrivateFieldDestructureSet(this, _valueRest).value] = [
            1,
            2,
            3
        ], swcHelpers.classPrivateFieldGet(this, _valueOne), swcHelpers.classPrivateFieldGet(this, _valueRest), swcHelpers.classPrivateFieldSet(this, _valueCompound, swcHelpers.classPrivateFieldGet(this, _valueCompound) + 3);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _value, {
            get: void 0,
            set: function(v) {}
        }), swcHelpers.classPrivateFieldInit(this, _valueRest, {
            get: void 0,
            set: function(v) {}
        }), swcHelpers.classPrivateFieldInit(this, _valueOne, {
            get: void 0,
            set: function(v) {}
        }), swcHelpers.classPrivateFieldInit(this, _valueCompound, {
            get: void 0,
            set: function(v) {}
        });
    }
}().m();
