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
var unused1 = _objectSpread({
    b: 1
}, ab) // error
;
var unused2 = _objectSpread({
}, ab, ab) // ok, overwritten error doesn't apply to spreads
;
var unused3 = _objectSpread({
    b: 1
}, abq) // ok, abq might have b: undefined
;
var unused4 = _objectSpread({
}, ab, {
    b: 1
}) // ok, we don't care that b in ab is overwritten
;
var unused5 = _objectSpread({
}, abq, {
    b: 1
}) // ok
;
function g(obj) {
    return _objectSpread({
        x: 1
    }, obj); // ok, obj might have x: undefined
}
function f(obj) {
    return _objectSpread({
        x: 1
    }, obj); // ok, obj might be undefined
}
function h(obj) {
    return _objectSpread({
        x: 1
    }, obj) // error
    ;
}
function i1(b, t) {
    return _objectSpread({
        command: "hi"
    }, b ? t : {
    }) // ok
    ;
}
function j() {
    return _objectSpread({
    }, {
        command: "hi"
    }, {
        command: "bye"
    }) // ok
    ;
}
function k(t) {
    return _objectSpread({
        command: "hi"
    }, {
        spoiler: true
    }, {
        spoiler2: true
    }, t) // error
    ;
}
function l(anyrequired) {
    return _objectSpread({
        a: 'zzz'
    }, anyrequired) // error
    ;
}
function m(anyoptional) {
    return _objectSpread({
        a: 'zzz'
    }, anyoptional) // ok
    ;
}
