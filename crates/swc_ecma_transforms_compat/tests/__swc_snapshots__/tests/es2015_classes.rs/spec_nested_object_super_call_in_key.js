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
    var _super = _create_super(Outer);
    function Outer() {
        _class_call_check(this, Outer);
        var _this;
        var Inner = {
            [_this = _super.call(this)] () {
                return 'hello';
            }
        };
        return _possible_constructor_return(_this, Inner);
    }
    return Outer;
}(Hello);
expect(new Outer().hello()).toBe('hello');
