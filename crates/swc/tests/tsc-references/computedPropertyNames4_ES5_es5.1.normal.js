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
// @target: es5
var s;
var n;
var a;
var _obj;
var v = (_obj = {
}, _defineProperty(_obj, s, 0), _defineProperty(_obj, n, n), _defineProperty(_obj, s + s, 1), _defineProperty(_obj, s + n, 2), _defineProperty(_obj, +s, s), _defineProperty(_obj, "", 0), _defineProperty(_obj, 0, 0), _defineProperty(_obj, a, 1), _defineProperty(_obj, true, 0), _defineProperty(_obj, "hello bye", 0), _defineProperty(_obj, "hello ".concat(a, " bye"), 0), _obj);
