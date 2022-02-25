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
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
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
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
// @target: es2015
let friendA;
var _x = new WeakMap();
class A {
    getX() {
        return _classPrivateFieldGet(this, _x);
    }
    constructor(v){
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _x, v);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        friendA = {
            getX (obj) {
                return _classPrivateFieldGet(obj, _x);
            },
            setX (obj, value) {
                _classPrivateFieldSet(obj, _x, value);
            }
        };
    })()
};
class B {
    constructor(a1){
        const x = friendA.getX(a1); // ok
        friendA.setX(a1, x + 1); // ok
    }
}
const a = new A(41);
const b = new B(a);
a.getX();
