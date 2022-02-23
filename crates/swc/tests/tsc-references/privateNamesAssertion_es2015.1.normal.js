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
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
// @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
class Foo {
    m1(v) {
        _classPrivateFieldGet(this, _p1).call(this, v);
        v;
    }
    constructor(){
        _classPrivateFieldInit(this, _p1, {
            writable: true,
            value: (v)=>{
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
}
var _p1 = new WeakMap();
var _p11 = new WeakSet();
class Foo2 {
    m1(v) {
        _classPrivateMethodGet(this, _p11, p1).call(this, v);
        v;
    }
    constructor(){
        _classPrivateMethodInit(this, _p11);
    }
}
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
