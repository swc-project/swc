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
function f() {
    var t;
    var k;
    var v = (_obj = {
    }, _defineProperty(_obj, t, 0), _defineProperty(_obj, k, 1), _obj);
}
