function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: genericSetterInClassTypeJsDoc.js
// @out: genericSetterInClassTypeJsDoc-out.js
/**
 * @template T
 */ class Box {
    /** @type {T} */ get value() {
        return _classPrivateFieldGet(this, _value);
    }
    set value(value) {
        _classPrivateFieldSet(this, _value, value);
    }
    /** @param {T} initialValue */ constructor(initialValue){
        _value.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _value, initialValue);
    }
}
var _value = new WeakMap();
new Box(3).value = 3;
