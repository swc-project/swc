var x, f2, f3, f4;
function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
_instanceof(x, void 0), _instanceof(x, f2), _instanceof(x, f3), _instanceof(x, f4), _instanceof(x, null), _instanceof(x, void 0);
