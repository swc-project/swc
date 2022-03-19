import * as swcHelpers from "@swc/helpers";
var _obj, obj = (_obj = {
    foo: void 0,
    bar: "42",
    method1: function(n1) {
        return n1 + 42;
    },
    lol: "hello Lol"
}, swcHelpers.defineProperty(_obj, "bar1", 42), swcHelpers.defineProperty(_obj, "arrowFunc", function(num) {
    return num + 42;
}), _obj);
obj.foo = 'string', obj.lol, obj.bar = void 0, obj.method1(0), obj.bar1 = "42", obj.arrowFunc(0);
