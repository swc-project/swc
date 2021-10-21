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
var E1;
(function(E) {
    E[E["x"] = 0] = "x";
})(E1 || (E1 = {
}));
var a;
extractIndexer(_defineProperty({
}, a, "")); // Should return string
extractIndexer(_defineProperty({
}, E1.x, "")); // Should return string
extractIndexer(_defineProperty({
}, "" || 0, "")); // Should return any (widened form of undefined)
