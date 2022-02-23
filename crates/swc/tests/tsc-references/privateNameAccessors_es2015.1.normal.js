function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
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
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
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
var _prop = new WeakSet(), _prop = new WeakSet(), _roProp = new WeakSet();
// @strict: true
// @target: es6
class A1 {
    constructor(name){
        _classPrivateMethodInit(this, _prop);
        _classPrivateMethodInit(this, _prop);
        _classPrivateMethodInit(this, _roProp);
        _classPrivateFieldSet(this, _prop, "");
        _classPrivateFieldSet(this, _roProp, ""); // Error
        console.log(_classPrivateMethodGet(this, _prop, prop));
        console.log(_classPrivateMethodGet(this, _roProp, roProp));
    }
}
function prop() {
    return "";
}
function prop(param) {}
function roProp() {
    return "";
}
