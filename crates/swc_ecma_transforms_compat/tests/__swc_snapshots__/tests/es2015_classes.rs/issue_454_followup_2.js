function broken(x, ...foo) {
    if (true) {
        var Foo = /*#__PURE__*/ function(Bar1) {
            "use strict";
            _inherits(Foo, Bar1);
            function Foo() {
                _class_call_check(this, Foo);
                return _call_super(this, Foo, arguments);
            }
            return Foo;
        }(Bar);
        return hello.apply(void 0, _to_consumable_array(foo));
    }
}
