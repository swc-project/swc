function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj = {
    p: "",
    0: function() {}
};
foo((_defineProperty(_obj, "hibye", !0), _defineProperty(_obj, 1, 0), _defineProperty(_obj, NaN, [
    0
]), _obj));
