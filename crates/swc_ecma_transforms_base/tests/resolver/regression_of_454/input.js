function broken(x) {
    var Foo = (function (_Bar) {
        _inherits(Foo, _Bar);
        function Foo() {
            _classCallCheck(this, Foo);
            return _possibleConstructorReturn(
                this,
                _getPrototypeOf(Foo).apply(this, arguments)
            );
        }
        return Foo;
    })(Bar);
}
