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
var v = (_obj = {
}, _defineProperty(_obj, e, 1), _defineProperty(_obj, e + e, 2), _obj);
