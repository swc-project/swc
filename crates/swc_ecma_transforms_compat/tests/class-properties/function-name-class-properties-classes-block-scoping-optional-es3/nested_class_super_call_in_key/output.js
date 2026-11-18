var Hello = function Hello() {
    "use strict";
    _class_call_check(this, Hello);
    return {
        toString () {
            return 'hello';
        }
    };
};
var Outer = /*#__PURE__*/ function(Hello) {
    "use strict";
    _inherits(Outer, Hello);
    function Outer() {
        _class_call_check(this, Outer);
        var _this;
        var _ref = _this = _call_super(this, Outer);
        var Inner = function Inner() {
            _class_call_check(this, Inner);
            _define_property(this, _ref, "hello");
        };
        return _possible_constructor_return(_this, new Inner());
    }
    return Outer;
}(Hello);
expect(new Outer().hello).toBe('hello');
