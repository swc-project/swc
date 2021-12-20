// @allowJS: true
// @suppressOutputPathCheck: true
// @filename: 0.js
// @ts-check
/** @type {String} */ var S = true;
/** @type {number} */ var n = "hello";
/** @type {function (number)} */ var x1 = function(a1) {
    return a1 + 1;
};
x1("string");
/** @type {function (number): number} */ var x2 = function(a2) {
    return a2 + 1;
};
/** @type {string} */ var a;
a = x2(0);
/** @type {function (number): number} */ var x3 = function(a3) {
    return a3.concat("hi");
};
x3(0);
/** @type {function (number): string} */ var x4 = function(a4) {
    return a4 + 1;
};
x4(0);
