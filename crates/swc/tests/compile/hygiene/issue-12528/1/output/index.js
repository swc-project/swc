var _instanceof = require("@swc/helpers/_/_instanceof");
// The name of a function expression is visible only inside its body, so an
// unresolved global with the same name used elsewhere cannot conflict with it.
var NativeMap = Map;
var MapPolyfill = function Map() {};
// Recursive references to the function expression itself keep the name.
var NativeSet = Set;
var SetPolyfill = function Set(iterable) {
    if (!_instanceof._(this, Set)) return new Set(iterable);
};
// A direct `eval` can refer to the global `Map` through a string, so the name
// that `function_name` infers must not be `Map`.
var obj = {
    Map: function Map1() {
        return eval("Map");
    }
};
