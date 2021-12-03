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
var // @target: es5,esnext
K;
(function(K1) {
    K1["a"] = "a";
    K1["b"] = "b";
})(K || (K = {
}));
var _obj;
var ref = function() {
    return _obj = {
    }, _defineProperty(_obj, K.a, 1), _defineProperty(_obj, K.b, 1), _obj;
}(), aVal = ref[K.a], bVal = ref[K.b];
console.log(aVal, bVal);
