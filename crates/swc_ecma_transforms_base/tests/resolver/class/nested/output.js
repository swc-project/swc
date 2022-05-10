var Outer__1 = function(_Hello__2) {
    _inherits(Outer__2, _Hello__2);
    function Outer__2() {
        _classCallCheck(this, Outer__2);
        var _this__4 = _possibleConstructorReturn(this, _getPrototypeOf(Outer__2).call(this));
        var Inner__4 = function() {
            function Inner__5() {
                _classCallCheck(this, Inner__5);
            }
            _createClass(Inner__5, [
                {
                    key: _get(_getPrototypeOf(Outer__2.prototype), "toString", _assertThisInitialized(_this__4)).call(_this__4),
                    value: function() {
                        return "hello";
                    }
                }, 
            ]);
            return Inner__5;
        }();
        return _possibleConstructorReturn(_this__4, new Inner__4());
    }
    return Outer__2;
}(Hello);
