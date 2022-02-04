function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
!function(K) {
    K.a = "a", K.b = "b";
}(K || (K = {}));
var K, ref = function() {
    var _obj;
    return _defineProperty(_obj = {}, K.a, 1), _defineProperty(_obj, K.b, 1), _obj;
}(), aVal = ref[K.a], bVal = ref[K.b];
console.log(aVal, bVal);
