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
        var Inner = {
            [_this = _call_super(this, Outer)] () {
                return 'hello';
            }
        };
        return _possible_constructor_return(_this, Inner);
    }
    return Outer;
}(Hello);
expect(new Outer().hello()).toBe('hello');
