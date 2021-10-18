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
var o = (_obj = {
}, _defineProperty(_obj, "" + 0, function(y) {
    return y.length;
}), _defineProperty(_obj, "" + 1, function(y) {
    return y.length;
}), _obj);
