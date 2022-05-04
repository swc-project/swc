var singleton;
var Sub = (function (_Foo) {
    _inherits(Sub, _Foo);
    function Sub() {
        var _this;
        _classCallCheck(this, Sub);
        if (singleton) {
            return _possibleConstructorReturn(_this, singleton);
        }
        singleton = _this = _possibleConstructorReturn(
            this,
            _getPrototypeOf(Sub).call(this)
        );
        return _possibleConstructorReturn(_this);
    }
    return Sub;
})(Foo);
