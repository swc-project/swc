function broken(x) {
    for(var _len = arguments.length, foo = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        foo[_key - 1] = arguments[_key];
    }
    if (true) {
        let Foo = /*#__PURE__*/ function(Bar1) {
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
