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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var o1;
var o1 = _objectSpread({
}, undefinedUnion);
var o2;
var o2 = _objectSpread({
}, nullUnion);
var o3;
var o3 = _objectSpread({
}, undefinedUnion, nullUnion);
var o3 = _objectSpread({
}, nullUnion, undefinedUnion);
var o4;
var o4 = _objectSpread({
}, undefinedUnion, undefinedUnion);
var o5;
var o5 = _objectSpread({
}, nullUnion, nullUnion);
