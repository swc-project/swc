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
    let n = 12;
    let m = 13;
    let a = null;
    const o1 = _objectSpread({
    }, {
    }, {
        [n]: n
    });
    const o2 = _objectSpread({
    }, {
    }, {
        [a]: n
    });
    const o3 = _objectSpread({
        [a]: n
    }, {
    }, {
        [n]: n
    }, {
    }, {
        [m]: m
    });
}
