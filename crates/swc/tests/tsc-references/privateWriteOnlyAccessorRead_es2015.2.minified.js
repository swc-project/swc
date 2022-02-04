function _classPrivateFieldSet(receiver, privateMap, value1) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value1, value1;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
        set value (v){
            descriptor.set.call(receiver, v);
        }
    }), descriptor.__destrObj;
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor;
}
var _value = new WeakSet(), _valueRest = new WeakSet(), _valueOne = new WeakSet(), _valueCompound = new WeakSet();
function value(v) {}
function valueRest(v) {}
function valueOne(v) {}
function valueCompound(v) {}
new class {
    m() {
        var _tmp, _tmp1;
        const foo = {
            bar: 1
        };
        console.log(_classPrivateMethodGet(this, _value, value)), _classPrivateFieldSet(this, _value, {
            foo
        }), _classPrivateFieldSet(this, _value, {
            foo
        }), _classPrivateMethodGet(this, _value, value).foo = foo, ({ o: _classPrivateFieldDestructureSet(this, _value).value  } = {
            o: {
                foo
            }
        }), _tmp = {
            foo
        }, _classPrivateFieldDestructureSet(this, _value).value = _extends({}, _tmp), ({ foo: _classPrivateMethodGet(this, _value, value).foo  } = {
            foo
        }), _tmp1 = {
            foo
        }, _classPrivateMethodGet(this, _value, value).foo = _extends({}, _tmp1.foo), ({ foo: {} ,  } = _tmp1), _classPrivateMethodGet(this, _value, value), [_classPrivateFieldDestructureSet(this, _valueOne).value, ..._classPrivateFieldDestructureSet(this, _valueRest).value] = [
            1,
            2,
            3
        ], _classPrivateMethodGet(this, _valueOne, valueOne), _classPrivateMethodGet(this, _valueRest, valueRest), _classPrivateFieldSet(this, _valueCompound, _classPrivateMethodGet(this, _valueCompound, valueCompound) + 3);
    }
    constructor(){
        _value.add(this), _valueRest.add(this), _valueOne.add(this), _valueCompound.add(this);
    }
}().m();
