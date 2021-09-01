var Outer1 = function(_Hello) {
    _inherits(Outer2, _Hello);
    function Outer2() {
        _classCallCheck(this, Outer2);
        var _this = _possibleConstructorReturn(this, _getPrototypeOf(Outer2).call(this));
        var Inner = function() {
            function Inner1() {
                _classCallCheck(this, Inner1);
            }
            _createClass(Inner1, [
                {
                    key: _get(_getPrototypeOf(Outer2.prototype), 'toString', _assertThisInitialized(_this)).call(_this),
                    value: function() {
                        return 'hello';
                    }
                }
            ]);
            return Inner1;
        }();
        return _possibleConstructorReturn(_this, new Inner());
    }
    return Outer2;
}(Hello);
