function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function foo(staticToString) {
    return _instanceof(staticToString, StaticToString);
}
function bar(staticToNumber) {
    return _instanceof(staticToNumber, StaticToNumber);
}
function baz(normal) {
    return _instanceof(normal, NormalToString);
}
