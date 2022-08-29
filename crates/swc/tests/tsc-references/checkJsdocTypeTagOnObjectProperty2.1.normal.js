//// [checkJsdocTypeTagOnObjectProperty2.ts]
//// [0.js]
// @ts-check
var lol;
var obj = {
    /** @type {string|undefined} */ bar: 42,
    /** @type {function(number): number} */ method1: function method1(n1) {
        return "42";
    },
    /** @type {function(number): number} */ method2: function(n1) {
        return "lol";
    },
    /** @type {function(number): number} */ arrowFunc: function() {
        var num = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "0";
        return num + 42;
    },
    /** @type {string} */ lol: lol
};
lol = "string";
/** @type {string} */ var s = obj.method1(0);
/** @type {string} */ var s1 = obj.method2("0");
