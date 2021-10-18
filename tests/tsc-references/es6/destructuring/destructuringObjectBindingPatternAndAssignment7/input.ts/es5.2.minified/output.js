function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
(K1 = K2 || (K2 = {
})).a = "a", K1.b = "b";
var K1, K2, _obj, ref = (_defineProperty(_obj = {
}, K2.a, 1), _defineProperty(_obj, K2.b, 1), _obj), aVal = ref[K2.a], bVal = ref[K2.b];
console.log(aVal, bVal);
