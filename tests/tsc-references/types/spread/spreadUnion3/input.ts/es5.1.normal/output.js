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
// @strictNullChecks: true
function f(x) {
    return _objectSpread({
        y: 123
    }, x) // y: string | number
    ;
}
f(undefined);
function g(t) {
    var b = _objectSpread({
    }, t);
    var c = b.a; // might not have 'a'
}
g();
g(undefined);
g(null);
var x1 = _objectSpread({
}, nullAndUndefinedUnion, nullAndUndefinedUnion);
var y = _objectSpread({
}, nullAndUndefinedUnion);
