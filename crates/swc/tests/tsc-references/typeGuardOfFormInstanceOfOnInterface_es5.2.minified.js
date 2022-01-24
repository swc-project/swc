var c1, c2, d1, c1Orc2, c2Ord1;
function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
_instanceof(c1Orc2, c1), _instanceof(c1Orc2, c2), _instanceof(c1Orc2, d1), _instanceof(c1Orc2, d1), _instanceof(c2Ord1, c2), _instanceof(c2Ord1, d1), _instanceof(c2Ord1, d1), _instanceof(c2Ord1, c1);
