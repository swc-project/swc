var sym__1 = Symbol();
var Foo__1 = function() {
    function Foo__3() {
        _classCallCheck(this, Foo__3);
    }
    _createClass(Foo__3, [
        {
            key: sym__1,
            value: function() {
                return 1;
            }
        }
    ]);
    return Foo__3;
}();
var Bar__1 = function(_Foo__6) {
    _inherits(Bar__6, _Foo__6);
    function Bar__6() {
        _classCallCheck(this, Bar__6);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar__6).apply(this, arguments));
    }
    _createClass(Bar__6, [
        {
            key: sym__1,
            value: function() {
                return _get(_getPrototypeOf(Bar__6.prototype), sym__1, this)() + 2;
            }
        }
    ]);
    return Bar__6;
}(Foo__1);
var i__1 = new Bar__1();
expect(i__1[sym__1]()).toBe(3);
