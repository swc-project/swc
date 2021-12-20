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
var p1;
var p2;
var p3;
var _obj;
var v = (_obj = {
}, _defineProperty(_obj, p1, 0), _defineProperty(_obj, p2, 1), _defineProperty(_obj, p3, 2), _obj);
