var Outer = function(_Hello__2) {
    _inherits(Outer__2, _Hello__2);
    function Outer__2() {
        _classCallCheck(this, Outer__2);
        var _this__3 = _possibleConstructorReturn(this, _getPrototypeOf(Outer__2).call(this));
        var Inner__3 = function() {
            function Inner__4() {
                _classCallCheck(this, Inner__4);
            }
            _createClass(Inner__4, [
                {
                    key: _get(_getPrototypeOf(Outer__2.prototype), 'toString', _assertThisInitialized(_this__3)).call(_this__3),
                    value: function() {
                        return 'hello';
                    }
                }
            ]);
            return Inner__4;
        }();
        return _possibleConstructorReturn(_this__3, new Inner__3());
    }
    return Outer__2;
}(Hello);
