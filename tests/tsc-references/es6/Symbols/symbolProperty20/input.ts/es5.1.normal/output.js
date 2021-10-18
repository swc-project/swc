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
var i = (_obj = {
}, _defineProperty(_obj, Symbol.iterator, function(s) {
    return s;
}), _defineProperty(_obj, Symbol.toStringTag, function(n) {
    return n;
}), _obj);
