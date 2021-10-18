// https://github.com/microsoft/TypeScript/issues/33857
// @useDefineForClassFields: true
// @target: es2015
"use strict";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var x = 1;
var C = function C() {
    _classCallCheck(this, C);
};
