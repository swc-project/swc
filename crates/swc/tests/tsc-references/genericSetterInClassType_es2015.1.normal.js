function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
// @target: esnext
var Generic;
(function(Generic) {
    class C {
        get y() {
            return 1;
        }
        set y(v) {}
    }
    var c = new C();
    c.y = c.y;
    class Box {
        get value() {
            return _classPrivateFieldGet(this, _value);
        }
        set value(value) {
            _classPrivateFieldSet(this, _value, value);
        }
        constructor(){
            _classPrivateFieldInit(this, _value, {
                writable: true,
                value: void 0
            });
        }
    }
    var _value = new WeakMap();
    new Box().value = 3;
})(Generic || (Generic = {}));
