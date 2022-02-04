function _defineProperty(obj1, key, value) {
    if (key in obj1) {
        Object.defineProperty(obj1, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj1[key] = value;
    }
    return obj1;
}
//@target: ES6
//@declaration: true
var obj = _defineProperty({}, Symbol.isConcatSpreadable, 0);
