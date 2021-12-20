function _defineProperty(obj1, key, value) {
    return key in obj1 ? Object.defineProperty(obj1, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj1[key] = value, obj1;
}
var _obj, obj = (_defineProperty(_obj = {
    foo: void 0,
    bar: "42",
    method1: function(n1) {
        return n1 + 42;
    },
    lol: "hello Lol"
}, "bar1", 42), _defineProperty(_obj, "arrowFunc", function(num) {
    return num + 42;
}), _obj);
obj.foo = "string", obj.lol, obj.bar = void 0, obj.method1(0), obj.bar1 = "42", obj.arrowFunc(0);
