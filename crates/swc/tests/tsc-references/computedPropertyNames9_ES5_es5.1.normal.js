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
function f(x) {
}
var _obj;
var v = (_obj = {
}, _defineProperty(_obj, f(""), 0), _defineProperty(_obj, f(0), 0), _defineProperty(_obj, f(true), 0), _obj);
