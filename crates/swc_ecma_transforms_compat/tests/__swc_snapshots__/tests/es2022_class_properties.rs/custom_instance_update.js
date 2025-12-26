var _x = new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _x, {
            writable: true,
            value: 0
        });
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test() {
                var _this, _this1, _this2, _this3, _this4;
                _this = this, _this1 = _class_private_field_get(_this, _x), _class_private_field_set(_this, _x, _this1 + (typeof _this1 === "bigint" ? 1n : 1)), _this1;
                _this2 = this, _this3 = (_this4 = _class_private_field_get(_this2, _x)) + (typeof _this4 === "bigint" ? 1n : 1), _class_private_field_set(_this2, _x, _this3), _this3;
            }
        }
    ]);
    return Foo;
}();
