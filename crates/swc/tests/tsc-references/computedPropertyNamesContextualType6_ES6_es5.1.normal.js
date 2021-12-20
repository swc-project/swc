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
foo((_obj = {
    p: "",
    0: function() {
    }
}, _defineProperty(_obj, "hi" + "bye", true), _defineProperty(_obj, 0 + 1, 0), _defineProperty(_obj, +"hi", [
    0
]), _obj));
