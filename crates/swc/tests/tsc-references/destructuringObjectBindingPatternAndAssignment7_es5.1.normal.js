import _define_property from "@swc/helpers/src/_define_property.mjs";
var // @target: es5,esnext
K;
(function(K) {
    K["a"] = "a";
    K["b"] = "b";
})(K || (K = {}));
var ref = function() {
    var _obj;
    return _obj = {}, _define_property(_obj, K.a, 1), _define_property(_obj, K.b, 1), _obj;
}(), aVal = ref[K.a], bVal = ref[K.b];
console.log(aVal, bVal);
