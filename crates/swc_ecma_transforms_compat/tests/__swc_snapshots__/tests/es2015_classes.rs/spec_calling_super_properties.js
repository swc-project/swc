var Test = /*#__PURE__*/ function(Foo1) {
    "use strict";
    _inherits(Test, Foo1);
    var _super = _create_super(Test);
    function Test() {
        _class_call_check(this, Test);
        var _this = _super.call(this);
        _get((_assert_this_initialized(_this), _get_prototype_of(Test.prototype)), "test", _this).whatever();
        _get((_assert_this_initialized(_this), _get_prototype_of(Test.prototype)), "test", _this).call(_this);
        return _this;
    }
    _create_class(Test, null, [
        {
            key: "test",
            value: function test() {
                return _get(_get_prototype_of(Test), "wow", this).call(this);
            }
        }
    ]);
    return Test;
}(Foo);
