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
var // @target: es6
E11;
(function(E1) {
    E1[E1["x"] = 0] = "x";
})(E11 || (E11 = {
}));
var E21;
(function(E2) {
    E2[E2["x"] = 0] = "x";
})(E21 || (E21 = {
}));
var o = _defineProperty({
}, E11.x || E21.x, 0);
