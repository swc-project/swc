let A = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(A, B);
    var _super = _create_super(A);
    function A() {
        _class_call_check(this, A);
        var _this;
        _update((_assert_this_initialized(_this), _get_prototype_of(A.prototype)), "foo", _this, true)._++;
        _update((_assert_this_initialized(_this), _get_prototype_of(A.prototype)), "bar", _this, true)._ += 123;
        _update((_assert_this_initialized(_this), _get_prototype_of(A.prototype)), baz, _this, true)._--;
        _update((_assert_this_initialized(_this), _get_prototype_of(A.prototype)), quz, _this, true)._ -= 456;
        return _possible_constructor_return(_this);
    }
    return A;
}(B);
