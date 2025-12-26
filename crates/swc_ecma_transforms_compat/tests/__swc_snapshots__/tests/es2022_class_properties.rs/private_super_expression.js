var _bar = new WeakMap();
var Foo = /*#__PURE__*/ function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    function Foo() {
        _class_call_check(this, Foo);
        var _this;
        _class_private_field_init(_assert_this_initialized(_this), _bar, {
            writable: true,
            value: "foo"
        });
        foo(_this = _call_super(this, Foo));
        return _this;
    }
    return Foo;
}(Bar);
