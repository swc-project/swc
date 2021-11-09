function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
_instanceof(x, Function) && (x(), x(1, 2, 3), x("hello!")), _instanceof(x, Object) && (x.method(), x()), _instanceof(x, Error), _instanceof(x, Date) && (x.getDate(), x.getHuors());
