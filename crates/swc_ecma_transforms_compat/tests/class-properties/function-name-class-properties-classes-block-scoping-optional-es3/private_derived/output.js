var _prop = /*#__PURE__*/ new WeakMap();
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    _class_private_field_init(this, _prop, {
        writable: true,
        value: "foo"
    });
};
var _prop1 = /*#__PURE__*/ new WeakMap();
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    function Bar() {
        _class_call_check(this, Bar);
        var _this;
        _this = _call_super(this, Bar, arguments), _class_private_field_init(_this, _prop1, {
            writable: true,
            value: "bar"
        });
        return _this;
    }
    return Bar;
}(Foo);
