var singleton;
var Sub1 = function(_Foo) {
    _inherits(Sub2, _Foo);
    function Sub2() {
        var _this;
        _classCallCheck(this, Sub2);
        if (singleton) {
            return _possibleConstructorReturn(_this, singleton);
        }
        singleton = _this = _possibleConstructorReturn(this, _getPrototypeOf(Sub2).call(this));
        return _possibleConstructorReturn(_this);
    }
    return Sub2;
}(Foo);
