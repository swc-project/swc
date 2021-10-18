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
var ref = _objectSpread({
}, {
}, {
    x: 0
}), x = ref.x;
var ref1 = _objectSpread({
    y: 0
}, {
}), y = ref1.y;
var ref2 = _objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
}), z = ref2.z, a = ref2.a, b = ref2.b;
var ref3 = _objectSpread({
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
}), c = ref3.c, d = ref3.d, e = ref3.e, f = ref3.f, g = ref3.g;
