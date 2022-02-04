function _defineProperty(obj1, key, value) {
    if (key in obj1) {
        Object.defineProperty(obj1, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj1[key] = value;
    }
    return obj1;
}
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
}, /** @type {number} */ _defineProperty(_obj, 'b' + 'ar1', 42), /** @type {function(number): number} */ _defineProperty(_obj, "arrowFunc", function(num) {
    return num + 42;
}), _obj);
obj.foo = 'string';
obj.lol;
obj.bar = undefined;
var k = obj.method1(0);
obj.bar1 = "42";
obj.arrowFunc(0);
