var _foo = /*#__PURE__*/ new WeakMap();
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
                var _other_obj;
                _class_private_field_get(this, _foo).call(this);
                _class_private_field_get(_other_obj = other.obj, _foo).call(_other_obj);
            }
        }
    ]);
    return Foo;
}();
