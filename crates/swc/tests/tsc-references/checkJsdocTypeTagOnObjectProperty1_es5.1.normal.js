import _define_property from "@swc/helpers/lib/_define_property.js";
// @allowJS: true
// @suppressOutputPathCheck: true
// @strictNullChecks: true
// @filename: 0.js
// @ts-check
var lol = "hello Lol";
var _obj;
var obj = (_obj = {
    /** @type {string|undefined} */ foo: undefined,
    /** @type {string|undefined} */ bar: "42",
    /** @type {function(number): number} */ method1: function method1(n1) {
        return n1 + 42;
    },
    /** @type {string} */ lol: lol
}, /** @type {number} */ _define_property(_obj, "b" + "ar1", 42), /** @type {function(number): number} */ _define_property(_obj, "arrowFunc", function(num) {
    return num + 42;
}), _obj);
obj.foo = "string";
obj.lol;
obj.bar = undefined;
var k = obj.method1(0);
obj.bar1 = "42";
obj.arrowFunc(0);
