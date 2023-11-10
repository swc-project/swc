var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    _create_class(A, [
        {
            key: "foo",
            value: function foo() {
                return "bar";
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "foo", _get((_assert_this_initialized(_this), _get_prototype_of(B.prototype)), "foo", _this).call(_this));
        return _this;
    }
    return B;
}(A);
