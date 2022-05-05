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
        }, 
    ]);
    return Foo__3;
}();
var Bar__1 = function(_Foo__4) {
    _inherits(Bar__4, _Foo__4);
    function Bar__4() {
        _classCallCheck(this, Bar__4);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar__4).apply(this, arguments));
    }
    _createClass(Bar__4, [
        {
            key: sym__1,
            value: function() {
                return _get(_getPrototypeOf(Bar__4.prototype), sym__1, this)() + 2;
            }
        }, 
    ]);
    return Bar__4;
}(Foo__1);
var i__1 = new Bar__1();
expect(i__1[sym__1]()).toBe(3);
