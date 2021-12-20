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
//@target: ES6
var x = (_obj = {
}, _defineProperty(_obj, Symbol.isConcatSpreadable, 0), _defineProperty(_obj, Symbol.isConcatSpreadable, 1), _obj);
