function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
var x1, x2, a, b, c, d, C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};
_instanceof(a, x1), _instanceof(b, x2), _instanceof(c, x1), _instanceof(d, x1);
