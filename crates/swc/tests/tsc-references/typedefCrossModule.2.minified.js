//// [commonjs.d.ts]
//// [mod1.js]
/// <reference path="./commonjs.d.ts"/>
/** @typedef {{ type: "a", x: 1 }} A */ /** @typedef {{ type: "b", y: 1 }} B */ /** @typedef {A | B} Both */ module.exports = function() {
    this.p = 1;
};
//// [mod2.js]
/// <reference path="./commonjs.d.ts"/>
/** @typedef {{ type: "a", x: 1 }} A */ /** @typedef {{ type: "b", y: 1 }} B */ /** @typedef {A | B} Both */ export function C() {
    this.p = 1;
}
//// [mod3.js]
/// <reference path="./commonjs.d.ts"/>
/** @typedef {{ type: "a", x: 1 }} A */ /** @typedef {{ type: "b", y: 1 }} B */ /** @typedef {A | B} Both */ exports.C = function() {
    this.p = 1;
};
//// [use.js]
/** @type {import('./mod1').Both} */ 
