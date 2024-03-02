let Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
let Test = /*#__PURE__*/ function(Foo1) {
    "use strict";
    _inherits(Test, Foo1);
    var _super = _create_super(Test);
    function Test() {
        _class_call_check(this, Test);
        return _super.apply(this, arguments);
    }
    _create_class(Test, [
        {
            key: "foo",
            value: function foo() {
                console.log(Foo);
            }
        }
    ]);
    return Test;
}(Foo);
