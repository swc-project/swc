//// [checkJsdocTypeTagOnObjectProperty1.ts]
//// [0.js]
// @ts-check
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _obj, obj = (/** @type {number} */ _define_property(_obj = {
    /** @type {string|undefined} */ foo: void 0,
    /** @type {string|undefined} */ bar: "42",
    /** @type {function(number): number} */ method1: function(n1) {
        return n1 + 42;
    },
    /** @type {string} */ lol: "hello Lol"
}, "bar1", 42), /** @type {function(number): number} */ _define_property(_obj, "arrowFunc", function(num) {
    return num + 42;
}), _obj);
obj.foo = "string", obj.lol, obj.bar = void 0, obj.method1(0), obj.bar1 = "42", obj.arrowFunc(0);
