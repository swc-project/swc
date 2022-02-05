function _classPrivateFieldSet(receiver, privateMap, value1) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value1;
    return value1;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (descriptor.set) {
        if (!("__destrObj" in descriptor)) {
            descriptor.__destrObj = {
                set value (v){
                    descriptor.set.call(receiver, v);
                }
            };
        }
        return descriptor.__destrObj;
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        return descriptor;
    }
}
var _value = new WeakSet(), _valueRest = new WeakSet(), _valueOne = new WeakSet(), _valueCompound = new WeakSet();
// @target: es2015
class Test {
    m() {
        const foo = {
            bar: 1
        };
        console.log(_classPrivateMethodGet(this, _value, value)); // error
        _classPrivateFieldSet(this, _value, {
            foo
        }); // ok
        _classPrivateFieldSet(this, _value, {
            foo
        }); // ok
        _classPrivateMethodGet(this, _value, value).foo = foo; // error
        ({ o: _classPrivateFieldDestructureSet(this, _value).value  } = {
            o: {
                foo
            }
        }); //ok
        var _tmp;
        _tmp = {
            foo
        }, _classPrivateFieldDestructureSet(this, _value).value = _extends({}, _tmp), _tmp; //ok
        ({ foo: _classPrivateMethodGet(this, _value, value).foo  } = {
            foo
        }); //error
        var _tmp1;
        _tmp1 = {
            foo
        }, _classPrivateMethodGet(this, _value, value).foo = _extends({}, _tmp1.foo), ({ foo: {} ,  } = _tmp1), _tmp1; //error
        let r = {
            o: _classPrivateMethodGet(this, _value, value)
        }; //error
        [_classPrivateFieldDestructureSet(this, _valueOne).value, ..._classPrivateFieldDestructureSet(this, _valueRest).value] = [
            1,
            2,
            3
        ];
        let arr = [
            _classPrivateMethodGet(this, _valueOne, valueOne),
            ..._classPrivateMethodGet(this, _valueRest, valueRest)
        ];
        _classPrivateFieldSet(this, _valueCompound, _classPrivateMethodGet(this, _valueCompound, valueCompound) + 3);
    }
    constructor(){
        _value.add(this);
        _valueRest.add(this);
        _valueOne.add(this);
        _valueCompound.add(this);
    }
}
function value(v) {}
function valueRest(v) {}
function valueOne(v) {}
function valueCompound(v) {}
new Test().m();
