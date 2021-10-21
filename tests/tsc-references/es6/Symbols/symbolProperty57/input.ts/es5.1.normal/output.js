function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
//@target: ES6
var obj1 = _defineProperty({
}, Symbol.iterator, 0);
// Should give type 'any'.
obj1[Symbol["nonsense"]];
