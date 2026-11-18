let Test = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Test, Foo);
    function Test() {
        _class_call_check(this, Test);
        var _this;
        woops.super.test();
        _this = _call_super(this, Test);
        Foo.prototype.test.call(_assert_this_initialized(_this));
        _this = _call_super(this, Test, arguments);
        _this = _call_super(this, Test, [
            "test",
            ...arguments
        ]);
        Foo.prototype.test.apply(_assert_this_initialized(_this), arguments);
        Foo.prototype.test.call(_assert_this_initialized(_this), "test", ...arguments);
        return _this;
    }
    return Test;
}(Foo);
