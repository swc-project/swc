//// [checkJsdocTypeTagOnObjectProperty1.ts]
//// [0.js]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _obj, obj = (_define_property(_obj = {
    foo: void 0,
    bar: "42",
    method1: function(n1) {
        return n1 + 42;
    },
    lol: "hello Lol"
}, "bar1", 42), _define_property(_obj, "arrowFunc", function(num) {
    return num + 42;
}), _obj);
obj.foo = 'string', obj.lol, obj.bar = void 0, obj.method1(0), obj.bar1 = "42", obj.arrowFunc(0);
