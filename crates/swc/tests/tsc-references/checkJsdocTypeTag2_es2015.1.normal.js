// @allowJS: true
// @suppressOutputPathCheck: true
// @filename: 0.js
// @ts-check
/** @type {String} */ var S = true;
/** @type {number} */ var n = "hello";
/** @type {function (number)} */ const x1 = (a1)=>a1 + 1;
x1("string");
/** @type {function (number): number} */ const x2 = (a2)=>a2 + 1;
/** @type {string} */ var a;
a = x2(0);
/** @type {function (number): number} */ const x3 = (a3)=>a3.concat("hi");
x3(0);
/** @type {function (number): string} */ const x4 = (a4)=>a4 + 1;
x4(0);
