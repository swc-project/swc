var _foo = new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: function() {
                return this;
            }
        });
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(other) {
                var _this, _other_obj;
                _this = this, _class_private_field_get(_this, _foo).call(_this);
                _other_obj = other.obj, _class_private_field_get(_other_obj, _foo).call(_other_obj);
            }
        }
    ]);
    return Foo;
}();
