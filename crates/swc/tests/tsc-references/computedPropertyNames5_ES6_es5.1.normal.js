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
// @target: es6
var b;
var _obj;
var v = (_obj = {
}, _defineProperty(_obj, b, 0), _defineProperty(_obj, true, 1), _defineProperty(_obj, [], 0), _defineProperty(_obj, {
}, 0), _defineProperty(_obj, undefined, undefined), _defineProperty(_obj, null, null), _obj);
