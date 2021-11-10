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
// @target: es6
var M;
(function(M) {
    var obj = _defineProperty({
    }, this.bar, 0);
})(M || (M = {
}));
