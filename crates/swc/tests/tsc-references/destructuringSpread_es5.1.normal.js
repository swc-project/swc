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
var x = _objectSpread({
}, {
}, {
    x: 0
}).x;
var y = _objectSpread({
    y: 0
}, {
}).y;
var ref = _objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
}), z = ref.z, a = ref.a, b = ref.b;
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
}), c = ref1.c, d = ref1.d, e = ref1.e, f = ref1.f, g = ref1.g;
