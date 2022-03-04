// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var x = 1;
var _x = x;
var C = function C() {
    _classCallCheck(this, C);
    this[_x] = true;
    var ref = {
        a: 1,
        b: 2
    }, a = ref.a, b = ref.b;
};
