import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Crunch = function Crunch() {
    "use strict";
    _class_call_check(this, Crunch);
};
// @Filename: use.js
var ex = require("./ex");
// values work
var crunch = new ex.Crunch(1);
crunch.n;
// types work
/**
 * @param {ex.Greatest} greatest
 * @param {ex.Crunch} wrap
 */ function f(greatest, wrap) {
    greatest.day;
    wrap.n;
}
