var singleton;
var Sub = function(_Foo__2) {
    _inherits(Sub__2, _Foo__2);
    function Sub__2() {
        var _this__3;
        _classCallCheck(this, Sub__2);
        if (singleton) {
            return _possibleConstructorReturn(_this__3, singleton);
        }
        singleton = _this__3 = _possibleConstructorReturn(this, _getPrototypeOf(Sub__2).call(this));
        return _possibleConstructorReturn(_this__3);
    }
    return Sub__2;
}(Foo);
