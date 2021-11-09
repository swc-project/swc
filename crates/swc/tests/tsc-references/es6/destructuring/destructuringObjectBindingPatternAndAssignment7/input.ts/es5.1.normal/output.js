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
K1;
(function(K) {
    K["a"] = "a";
    K["b"] = "b";
})(K1 || (K1 = {
}));
var _obj;
var ref = function() {
    return _obj = {
    }, _defineProperty(_obj, K1.a, 1), _defineProperty(_obj, K1.b, 1), _obj;
}(), aVal = ref[K1.a], bVal = ref[K1.b];
console.log(aVal, bVal);
