function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj, K = {
    a: "a",
    b: "b"
}, ref = (_defineProperty(_obj = {
}, K.a, 1), _defineProperty(_obj, K.b, 1), _obj), aVal = ref[K.a], bVal = ref[K.b];
console.log(aVal, bVal);
