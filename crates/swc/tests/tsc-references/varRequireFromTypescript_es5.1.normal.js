function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
export var Crunch = function Crunch() {
    "use strict";
    _classCallCheck(this, Crunch);
};
// @Filename: use.js
var ex = require('./ex');
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
