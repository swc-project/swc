var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        this.a_num = 10;
    }
    _create_class(A, [
        {
            key: "print",
            value: function print() {
                expect(this.a_num).toBe(10);
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B(num) {
        _class_call_check(this, B);
        var _this;
        _this = _call_super(this, B);
        _this.b_num = num;
        return _this;
    }
    _create_class(B, [
        {
            key: "print",
            value: function print() {
                expect(this.b_num).toBe(20);
                _get(_get_prototype_of(B.prototype), "print", this).call(this);
            }
        }
    ]);
    return B;
}(A);
