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
// fixes #12200
function f() {
    var n = 12;
    var m = 13;
    var a = null;
    var o1 = _objectSpread({
    }, {
    }, _defineProperty({
    }, n, n));
    var o2 = _objectSpread({
    }, {
    }, _defineProperty({
    }, a, n));
    var o3 = _objectSpread(_defineProperty({
    }, a, n), {
    }, _defineProperty({
    }, n, n), {
    }, _defineProperty({
    }, m, m));
}
