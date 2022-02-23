function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
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
var _value = new WeakMap();
new class {
    get value() {
        var receiver, privateMap, descriptor, receiver, descriptor;
        return receiver = this, (descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _value, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
    }
    set value(value) {
        _classPrivateFieldSet(this, _value, value);
    }
    constructor(initialValue){
        !function(obj, privateMap, value) {
            (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap), privateMap.set(obj, value);
        }(this, _value, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldSet(this, _value, initialValue);
    }
}(3).value = 3;
