var _foo = new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 0
        });
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(other) {
                var _this, _this1, _this2, _this3, _this4, _other_obj, _other_obj1, _other_obj2, _other_obj3, _other_obj4;
                _this = this, _this1 = _class_private_field_get(_this, _foo), _class_private_field_set(_this, _foo, _this1 + (typeof _this1 === "bigint" ? 1n : 1)), _this1;
                _this2 = this, _this3 = (_this4 = _class_private_field_get(_this2, _foo)) + (typeof _this4 === "bigint" ? 1n : 1), _class_private_field_set(_this2, _foo, _this3), _this3;
                _other_obj = other.obj, _other_obj1 = _class_private_field_get(_other_obj, _foo), _class_private_field_set(_other_obj, _foo, _other_obj1 + (typeof _other_obj1 === "bigint" ? 1n : 1)), _other_obj1;
                _other_obj2 = other.obj, _other_obj3 = (_other_obj4 = _class_private_field_get(_other_obj2, _foo)) + (typeof _other_obj4 === "bigint" ? 1n : 1), _class_private_field_set(_other_obj2, _foo, _other_obj3), _other_obj3;
            }
        }
    ]);
    return Foo;
}();
