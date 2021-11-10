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
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
var v = _defineProperty({
}, _await, foo);
