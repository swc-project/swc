let A = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(A, B);
    function A() {
        _class_call_check(this, A);
        var _this;
        _update(A.prototype, "foo", _this, true)._++;
        _update(A.prototype, "bar", _this, true)._ += 123;
        _update(A.prototype, baz, _this, true)._--;
        _update(A.prototype, quz, _this, true)._ -= 456;
        return _assert_this_initialized(_this);
    }
    return A;
}(B);
