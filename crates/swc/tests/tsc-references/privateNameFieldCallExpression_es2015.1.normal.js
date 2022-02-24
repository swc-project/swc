function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
// @target: es2015
class A {
    test() {
        var ref;
        var _ref;
        _classPrivateFieldGet(this, _fieldFunc).call(this);
        (ref = _classPrivateFieldGet(this, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(this);
        const func = _classPrivateFieldGet(this, _fieldFunc);
        func();
        new (_classPrivateFieldGet(this, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classPrivateFieldGet(this, _fieldFunc2).call(this, 0, ...arr, 3);
        const b = new (_classPrivateFieldGet(this, _fieldFunc2))(0, ...arr, 3);
        const str = _classPrivateFieldGet(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`;
        _classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _classPrivateFieldInit(this, _fieldFunc, {
            writable: true,
            value: function() {
                this.x = 10;
            }
        });
        _classPrivateFieldInit(this, _fieldFunc2, {
            writable: true,
            value: function(a, ...b) {}
        });
        this.x = 1;
    }
}
