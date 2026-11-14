// The name of a function expression is visible only inside its body, so an
// unresolved global with the same name used elsewhere cannot conflict with it.
var NativeMap = Map;
var MapPolyfill = function Map() {};

// Recursive references to the function expression itself keep the name.
var NativeSet = Set;
var SetPolyfill = function Set(iterable) {
    if (!(this instanceof Set)) return new Set(iterable);
};
