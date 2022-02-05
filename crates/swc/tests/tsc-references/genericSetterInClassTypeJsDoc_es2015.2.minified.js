function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
var _value = new WeakMap();
new class {
    get value() {
        return (function(receiver, privateMap) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver).value;
        })(this, _value);
    }
    set value(value) {
        _classPrivateFieldSet(this, _value, value);
    }
    constructor(initialValue){
        _value.set(this, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldSet(this, _value, initialValue);
    }
}(3).value = 3;
