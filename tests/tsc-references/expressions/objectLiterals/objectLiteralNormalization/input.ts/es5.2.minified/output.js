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
var a1 = {
    a: 0
};
a1.a, a1.b, a1.c, a1 = {
    a: 1
}, a1 = {
    a: 0,
    b: 0
}, a1 = {
    b: "y"
}, a1 = {
    c: !0
};
var a2 = {
    a: 1,
    b: 2
};
a2.a, a2.b, a2 = {
    a: 10,
    b: 20
}, a2 = {
    a: "def"
}, a2 = {
}, a2 = {
    a: "def",
    b: 20
}, a2 = {
    a: 1
};
var b2 = _objectSpread({
}, b1, {
    z: 55
});
_objectSpread({
}, b2);
var d1 = {
    kind: "a",
    pos: {
        x: 0,
        y: 0
    }
};
d1.kind, d1.pos, d1.pos.x, d1.pos.y, d1.pos.a, d1.pos.b, f({
    a: 1,
    b: 2
}, {
    a: "abc"
}, {
}), f({
}, {
    a: "abc"
}, {
    a: 1,
    b: 2
}), f(data, {
    a: 2
}), f({
    a: 2
}, data);
