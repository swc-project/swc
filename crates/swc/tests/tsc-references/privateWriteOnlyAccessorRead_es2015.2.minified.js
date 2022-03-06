function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
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
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return (function(receiver, descriptor) {
        if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
            set value (v){
                descriptor.set.call(receiver, v);
            }
        }), descriptor.__destrObj;
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        return descriptor;
    })(receiver, descriptor);
}
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
new class {
    m() {
        var _tmp, _tmp1;
        const foo = {
            bar: 1
        };
        console.log(_classPrivateFieldGet(this, _value)), _classPrivateFieldSet(this, _value, {
            foo
        }), _classPrivateFieldSet(this, _value, {
            foo
        }), _classPrivateFieldGet(this, _value).foo = foo, ({ o: _classPrivateFieldDestructureSet(this, _value).value  } = {
            o: {
                foo
            }
        }), _tmp = {
            foo
        }, _classPrivateFieldDestructureSet(this, _value).value = _extends({}, _tmp), ({ foo: _classPrivateFieldGet(this, _value).foo  } = {
            foo
        }), _tmp1 = {
            foo
        }, _classPrivateFieldGet(this, _value).foo = _extends({}, _tmp1.foo), ({ foo: {} ,  } = _tmp1), _classPrivateFieldGet(this, _value), [_classPrivateFieldDestructureSet(this, _valueOne).value, ..._classPrivateFieldDestructureSet(this, _valueRest).value] = [
            1,
            2,
            3
        ], _classPrivateFieldGet(this, _valueOne), _classPrivateFieldGet(this, _valueRest), _classPrivateFieldSet(this, _valueCompound, _classPrivateFieldGet(this, _valueCompound) + 3);
    }
    constructor(){
        _classPrivateFieldInit(this, _value, {
            get: void 0,
            set: function(v) {}
        }), _classPrivateFieldInit(this, _valueRest, {
            get: void 0,
            set: function(v) {}
        }), _classPrivateFieldInit(this, _valueOne, {
            get: void 0,
            set: function(v) {}
        }), _classPrivateFieldInit(this, _valueCompound, {
            get: void 0,
            set: function(v) {}
        });
    }
}().m();
