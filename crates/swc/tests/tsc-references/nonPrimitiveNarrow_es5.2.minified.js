var a, b, Narrow = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Narrow);
};
(function(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
})(a, Narrow) && (a.narrowed, a = 123), "number" == typeof a && a.toFixed(), b.toString();
