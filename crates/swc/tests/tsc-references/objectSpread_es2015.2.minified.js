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
let o = {
    a: 1,
    b: "no"
}, o2 = {
    b: "yes",
    c: !0
};
_objectSpread({
}, o, {
    c: !1
}), _objectSpread({
    c: !1
}, o), _objectSpread({
}, o, {
    b: "override"
}), _objectSpread({
}, _objectSpread({
    a: 3
}, {
    b: !1,
    c: "overriden"
}), {
    c: "whatever"
}), _objectSpread({
}, o, o2), _objectSpread({
}, o, o2, {
    b: "ok"
}), _objectSpread({
}, _objectSpread({
    a: 1
}, {
    b: !1,
    c: "overriden"
}), {
    c: -1
}), _objectSpread({
}, o), _objectSpread({
}, {
    get a () {
        return 6;
    }
}, {
    c: 7
}).a = 12, _objectSpread({
}, function() {
}), _objectSpread({
}, void 0);
let c = new class {
    m() {
    }
    constructor(){
        this.p = 1;
    }
}();
function f(t, u) {
    return _objectSpread({
    }, t, u, {
        id: "id"
    });
}
_objectSpread({
}, c), _objectSpread({
}, c, {
    plus () {
        return this.p + 1;
    }
}).plus(), _objectSpread({
}, o, {
    a: "wrong type?"
}), _objectSpread({
}, o, {
    a: "yes",
    b: -1
}), _objectSpread({
}, o, {
    a: 12
}), _objectSpread({
}, {
}), f({
    a: 1,
    b: "yes"
}, {
    c: "no",
    d: !1
}), f({
    a: 1
}, {
    a: 2,
    b: "extra"
}), f({
    a: 1
}, {
    a: "mismatch"
}), f({
    a: 1,
    id: !0
}, {
    c: 1,
    d: "no"
});
