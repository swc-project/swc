import _define_property from "@swc/helpers/lib/_define_property.js";
!function(K) {
    K.a = "a", K.b = "b";
}(K || (K = {}));
var K, ref = function() {
    var _obj;
    return _define_property(_obj = {}, K.a, 1), _define_property(_obj, K.b, 1), _obj;
}(), aVal = ref[K.a], bVal = ref[K.b];
console.log(aVal, bVal);
