// The name of a class expression is visible only inside its body, so an
// unresolved global with the same name used elsewhere cannot conflict with it.
var NativeURL = URL;
var URLPolyfill = class URL {
    static create() {
        return new URL();
    }
};
// Function expressions keep their names with modern targets, too.
var NativeMap = Map;
var MapPolyfill = function Map() {
    return Map;
};
