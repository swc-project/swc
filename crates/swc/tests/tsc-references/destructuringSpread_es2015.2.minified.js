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
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
const { x  } = _objectSpread({
}, {
}, {
    x: 0
}), { y  } = _objectSpread({
    y: 0
}, {
}), { z , a , b  } = _objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
}), { c , d , e , f , g  } = _objectSpread({
}, _objectSpread({
}, _objectSpread({
}, {
    c: 0
}, {
    d: 0
}), {
    e: 0
}), {
    f: 0
});
