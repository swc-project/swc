var sym = Symbol();
var Foo = function() {
    function Foo1() {
        _classCallCheck(this, Foo1);
    }
    _createClass(Foo1, [
        {
            key: sym,
            value: function() {
                return 1;
            }
        }
    ]);
    return Foo1;
}();
var Bar1 = function(_Foo) {
    _inherits(Bar2, _Foo);
    function Bar2() {
        _classCallCheck(this, Bar2);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar2).apply(this, arguments));
    }
    _createClass(Bar2, [
        {
            key: sym,
            value: function() {
                return _get(_getPrototypeOf(Bar2.prototype), sym, this)() + 2;
            }
        }
    ]);
    return Bar2;
}(Foo);
var i = new Bar1();
expect(i[sym]()).toBe(3);
