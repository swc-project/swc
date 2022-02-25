var a;
!function(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
}(a, a);
