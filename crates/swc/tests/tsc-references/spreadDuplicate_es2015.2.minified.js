function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
_objectSpread({
    a: 123
}, a), _objectSpread({
    a: 123
}, b), _objectSpread({
    a: 123
}, c), _objectSpread({
    a: 123
}, d), _objectSpread({
    a: 123
}, t ? a : {}), _objectSpread({
    a: 123
}, t ? b : {}), _objectSpread({
    a: 123
}, t ? c : {}), _objectSpread({
    a: 123
}, t ? d : {});
