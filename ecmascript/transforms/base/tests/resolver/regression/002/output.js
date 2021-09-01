var sym = Symbol();
var Foo = function() {
    function Foo__2() {
        _classCallCheck(this, Foo__2);
    }
    _createClass(Foo__2, [
        {
            key: sym,
            value: function() {
                return 1;
            }
        }
    ]);
    return Foo__2;
}();
var Bar = function(_Foo__3) {
    _inherits(Bar__3, _Foo__3);
    function Bar__3() {
        _classCallCheck(this, Bar__3);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar__3).apply(this, arguments));
    }
    _createClass(Bar__3, [
        {
            key: sym,
            value: function() {
                return _get(_getPrototypeOf(Bar__3.prototype), sym, this)() + 2;
            }
        }
    ]);
    return Bar__3;
}(Foo);
var i = new Bar();
expect(i[sym]()).toBe(3);
