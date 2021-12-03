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
E1;
(function(E11) {
    E11[E11["x"] = 0] = "x";
})(E1 || (E1 = {
}));
var E2;
(function(E21) {
    E21[E21["x"] = 0] = "x";
})(E2 || (E2 = {
}));
var o = _defineProperty({
}, E1.x || E2.x, 0);
