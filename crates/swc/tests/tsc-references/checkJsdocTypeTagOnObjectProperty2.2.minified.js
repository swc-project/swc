//// [checkJsdocTypeTagOnObjectProperty2.ts]
//// [0.js]
// @ts-check
var lol, obj = {
    /** @type {string|undefined} */ bar: 42,
    /** @type {function(number): number} */ method1: function(n1) {
        return "42";
    },
    /** @type {function(number): number} */ method2: function(n1) {
        return "lol";
    },
    /** @type {function(number): number} */ arrowFunc: function() {
        var num = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "0";
        return num + 42;
    },
    /** @type {string} */ lol: lol
};
lol = "string", obj.method1(0), obj.method2("0");
