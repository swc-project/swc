// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _key;
var x = 1;
var C = function C() {
    _classCallCheck(this, C);
    this[_key] = true;
    var ref = {
        a: 1,
        b: 2
    }, a = ref.a, b = ref.b;
};
_key = x;
