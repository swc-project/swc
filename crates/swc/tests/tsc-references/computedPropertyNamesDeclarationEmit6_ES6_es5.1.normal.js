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
// @target: es6
// @declaration: true
var v = (_obj = {
}, _defineProperty(_obj, -1, {
}), _defineProperty(_obj, +1, {
}), _defineProperty(_obj, ~1, {
}), _defineProperty(_obj, !1, {
}), _obj);
