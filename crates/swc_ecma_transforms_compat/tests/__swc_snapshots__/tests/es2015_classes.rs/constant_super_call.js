let Test = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Test, Foo);
    var _super = _create_super(Test);
    function Test() {
        _class_call_check(this, Test);
        var _this = _super.call(this);
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
