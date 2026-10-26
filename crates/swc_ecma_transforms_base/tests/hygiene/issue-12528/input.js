var NativeMap = Map;
var MapPolyfill = function Map() {};
var RecursiveMap = function Map(value = Map) {
    return value || Map;
};
var NestedMap = function Map() {
    return function () { return Map; };
};
function readNative() {
    return Map;
}
