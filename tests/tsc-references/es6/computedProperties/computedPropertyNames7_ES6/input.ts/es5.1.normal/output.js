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
E;
(function(E) {
    E[E["member"] = 0] = "member";
})(E || (E = {
}));
var v = _defineProperty({
}, E.member, 0);
