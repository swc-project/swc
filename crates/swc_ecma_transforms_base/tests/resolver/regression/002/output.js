var sym__2 = Symbol();
var Foo__2 = function() {
    function Foo__3() {
        _classCallCheck(this, Foo__3);
    }
    _createClass(Foo__3, [
        {
            key: sym__2,
            value: function() {
                return 1;
            }
        }
    ]);
    return Foo__3;
}();
var Bar__2 = function(_Foo__6) {
    _inherits(Bar__6, _Foo__6);
    function Bar__6() {
        _classCallCheck(this, Bar__6);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar__6).apply(this, arguments));
    }
    _createClass(Bar__6, [
        {
            key: sym__2,
            value: function() {
                return _get(_getPrototypeOf(Bar__6.prototype), sym__2, this)() + 2;
            }
        }
    ]);
    return Bar__6;
}(Foo__2);
var i__2 = new Bar__2();
expect(i__2[sym__2]()).toBe(3);
