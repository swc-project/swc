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
var _obj;
//@target: ES6
var i = (_obj = {
}, _defineProperty(_obj, Symbol.iterator, {
    p: null
}), _defineProperty(_obj, Symbol.toStringTag, function() {
    return {
        p: undefined
    };
}), _obj);
var it = i[Symbol.iterator];
var str = i[Symbol.toStringTag]();
