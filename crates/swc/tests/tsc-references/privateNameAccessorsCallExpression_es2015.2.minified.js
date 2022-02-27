function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var _ref;
        _classPrivateFieldGet(this, _fieldFunc).call(this);
        const func = _classPrivateFieldGet(this, _fieldFunc);
        func(), new (_classPrivateFieldGet(this, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classPrivateFieldGet(this, _fieldFunc2).call(this, 0, ...arr, 3), new (_classPrivateFieldGet(this, _fieldFunc2))(0, ...arr, 3), _classPrivateFieldGet(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`, _classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _classPrivateFieldInit(this, _fieldFunc, {
            get: function() {
                return function() {
                    this.x = 10;
                };
            },
            set: void 0
        }), _classPrivateFieldInit(this, _fieldFunc2, {
            get: function() {
                return function(a, ...b) {};
            },
            set: void 0
        }), this.x = 1;
    }
}
