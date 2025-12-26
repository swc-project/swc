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
var _foo = /*#__PURE__*/ new WeakMap();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        var _this;
        _this = _call_super(this, B, arguments), _class_private_field_init(_this, _foo, {
            writable: true,
            value: _get((_assert_this_initialized(_this), _get_prototype_of(B.prototype)), "foo", _this).call(_this)
        });
        return _this;
    }
    return B;
}(A);
