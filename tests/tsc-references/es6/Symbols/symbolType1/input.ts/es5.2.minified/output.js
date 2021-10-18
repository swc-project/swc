function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
_instanceof(Symbol(), Symbol), _instanceof(Symbol, Symbol()), _instanceof(Symbol() || {
}, Object), _instanceof(Symbol, Symbol() || {
});
