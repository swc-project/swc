var Outer__2 = function(_Hello__3) {
    _inherits(Outer__3, _Hello__3);
    function Outer__3() {
        _classCallCheck(this, Outer__3);
        var _this__4 = _possibleConstructorReturn(this, _getPrototypeOf(Outer__3).call(this));
        var Inner__4 = function() {
            function Inner__5() {
                _classCallCheck(this, Inner__5);
            }
            _createClass(Inner__5, [
                {
                    key: _get(_getPrototypeOf(Outer__3.prototype), "toString", _assertThisInitialized(_this__4)).call(_this__4),
                    value: function() {
                        return "hello";
                    }
                }
            ]);
            return Inner__5;
        }();
        return _possibleConstructorReturn(_this__4, new Inner__4());
    }
    return Outer__3;
}(Hello);
