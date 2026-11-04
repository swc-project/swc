let Test = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Test, Foo);
    function Test() {
        _class_call_check(this, Test);
        var _this;
        _this = _call_super(this, Test);
        Foo.prototype.test.whatever();
        Foo.prototype.test.call(_assert_this_initialized(_this));
        return _this;
    }
    _create_class(Test, null, [
        {
            key: "test",
            value: function test() {
                return Foo.wow.call(this);
            }
        }
    ]);
    return Test;
}(Foo);
