var Outer = (function (_Hello) {
    _inherits(Outer, _Hello);
    function Outer() {
        _classCallCheck(this, Outer);
        var _this = _possibleConstructorReturn(
            this,
            _getPrototypeOf(Outer).call(this)
        );
        var Inner = (function () {
            function Inner() {
                _classCallCheck(this, Inner);
            }
            _createClass(Inner, [
                {
                    key: _get(
                        _getPrototypeOf(Outer.prototype),
                        "toString",
                        _assertThisInitialized(_this)
                    ).call(_this),
                    value: function () {
                        return "hello";
                    },
                },
            ]);
            return Inner;
        })();
        return _possibleConstructorReturn(_this, new Inner());
    }
    return Outer;
})(Hello);
