//// [checkJsdocTypeTag2.ts]
//// [0.js]
// @ts-check
/** @type {String} */ var S = true;
/** @type {number} */ var n = "hello";
/** @type {function (number)} */ var x1 = function x1(a) {
    return a + 1;
};
x1("string");
/** @type {function (number): number} */ var x2 = function x2(a) {
    return a + 1;
};
/** @type {string} */ var a;
a = x2(0);
/** @type {function (number): number} */ var x3 = function x3(a) {
    return a.concat("hi");
};
x3(0);
/** @type {function (number): string} */ var x4 = function x4(a) {
    return a + 1;
};
x4(0);
