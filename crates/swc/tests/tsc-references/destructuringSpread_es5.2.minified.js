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
_objectSpread({
}, {
}, {
    x: 0
}).x, _objectSpread({
    y: 0
}, {
}).y;
var ref = _objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
});
ref.z, ref.a, ref.b;
var ref1 = _objectSpread({
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
ref1.c, ref1.d, ref1.e, ref1.f, ref1.g;
