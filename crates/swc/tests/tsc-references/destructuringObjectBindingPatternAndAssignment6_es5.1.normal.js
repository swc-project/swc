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
// @target: es5,esnext
var a = "a";
var b = "b";
var ref = function() {
    var _obj;
    return _obj = {
    }, _defineProperty(_obj, a, 1), _defineProperty(_obj, b, 1), _obj;
}(), aVal = ref[a], bVal = ref[b];
console.log(aVal, bVal);
