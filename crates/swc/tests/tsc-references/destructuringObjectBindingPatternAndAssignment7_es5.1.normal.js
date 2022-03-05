import * as swcHelpers from "@swc/helpers";
var // @target: es5,esnext
K;
(function(K) {
    K["a"] = "a";
    K["b"] = "b";
})(K || (K = {}));
var ref = function() {
    var _obj;
    return _obj = {}, swcHelpers.defineProperty(_obj, K.a, 1), swcHelpers.defineProperty(_obj, K.b, 1), _obj;
}(), aVal = ref[K.a], bVal = ref[K.b];
console.log(aVal, bVal);
