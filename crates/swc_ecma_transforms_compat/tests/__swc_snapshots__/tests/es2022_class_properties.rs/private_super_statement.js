var _bar = /*#__PURE__*/ new WeakMap();
var Foo = /*#__PURE__*/ function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    function Foo() {
        _class_call_check(this, Foo);
        var _this;
        _this = _call_super(this, Foo), _class_private_field_init(_this, _bar, {
            writable: true,
            value: "foo"
        });
        return _this;
    }
    return Foo;
}(Bar);
