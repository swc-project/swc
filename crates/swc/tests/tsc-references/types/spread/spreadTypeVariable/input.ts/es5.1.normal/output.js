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
function f1(arg) {
    return _objectSpread({
    }, arg);
}
function f2(arg) {
    return _objectSpread({
    }, arg);
}
function f3(arg) {
    return _objectSpread({
    }, arg);
}
function f4(arg) {
    return _objectSpread({
    }, arg);
}
function f5(arg) {
    return _objectSpread({
    }, arg);
}
function f6(arg) {
    return _objectSpread({
    }, arg);
}
