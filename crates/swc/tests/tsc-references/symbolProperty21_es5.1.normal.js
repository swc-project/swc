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
var _obj;
foo((_obj = {
}, _defineProperty(_obj, Symbol.isConcatSpreadable, ""), _defineProperty(_obj, Symbol.toPrimitive, 0), _defineProperty(_obj, Symbol.unscopables, true), _obj));
