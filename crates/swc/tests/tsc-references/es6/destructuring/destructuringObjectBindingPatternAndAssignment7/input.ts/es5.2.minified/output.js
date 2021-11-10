function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
(K = K1 || (K1 = {
})).a = "a", K.b = "b";
var K, K1, _obj, ref = (_defineProperty(_obj = {
}, K1.a, 1), _defineProperty(_obj, K1.b, 1), _obj), aVal = ref[K1.a], bVal = ref[K1.b];
console.log(aVal, bVal);
