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
// @target: es5
var s;
var n;
var a;
var _obj;
var v = (_obj = {
}, _defineProperty(_obj, s, function() {
}), _defineProperty(_obj, n, function() {
}), _defineProperty(_obj, s + s, function() {
}), _defineProperty(_obj, s + n, function() {
}), _defineProperty(_obj, +s, function() {
}), _defineProperty(_obj, "", function() {
}), _defineProperty(_obj, 0, function() {
}), _defineProperty(_obj, a, function() {
}), _defineProperty(_obj, true, function() {
}), _defineProperty(_obj, "hello bye", function() {
}), _defineProperty(_obj, "hello ".concat(a, " bye"), function() {
}), _obj);
