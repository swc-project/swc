var Test = function Test() {
    "use strict";
    _class_call_check(this, Test);
    this.state = "test";
};
var Foo = /*#__PURE__*/ function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    var _super = _create_super(Foo);
    function Foo() {
        _class_call_check(this, Foo);
        var _this;
        _this = _super.call(this);
        _this.state = "test";
        return _this;
    }
    return Foo;
}(Bar);
var ConstructorScoping = function ConstructorScoping() {
    "use strict";
    _class_call_check(this, ConstructorScoping);
    var bar;
    {
        var bar1;
    }
};
