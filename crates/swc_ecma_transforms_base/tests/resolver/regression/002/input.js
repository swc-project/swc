var sym = Symbol();
var Foo = (function () {
    function Foo() {
        _classCallCheck(this, Foo);
    }
    _createClass(Foo, [
        {
            key: sym,
            value: function () {
                return 1;
            },
        },
    ]);
    return Foo;
})();
var Bar = (function (_Foo) {
    _inherits(Bar, _Foo);
    function Bar() {
        _classCallCheck(this, Bar);
        return _possibleConstructorReturn(
            this,
            _getPrototypeOf(Bar).apply(this, arguments)
        );
    }
    _createClass(Bar, [
        {
            key: sym,
            value: function () {
                return _get(_getPrototypeOf(Bar.prototype), sym, this)() + 2;
            },
        },
    ]);
    return Bar;
})(Foo);
var i = new Bar();
expect(i[sym]()).toBe(3);
