function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj, ref = (_defineProperty(_obj = {
}, "a", 1), _defineProperty(_obj, "b", 1), _obj), aVal = ref.a, bVal = ref.b;
console.log(aVal, bVal);
