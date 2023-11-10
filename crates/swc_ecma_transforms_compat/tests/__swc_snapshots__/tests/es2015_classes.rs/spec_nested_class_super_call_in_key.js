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
        var _this = this;
        var _this1;
        var Inner = /*#__PURE__*/ function() {
            function Inner() {
                _class_call_check(this, Inner);
            }
            _create_class(Inner, [
                {
                    key: _this1 = _super.call(_this),
                    value: function() {
                        return 'hello';
                    }
                }
            ]);
            return Inner;
        }();
        return _possible_constructor_return(_this1, new Inner());
    }
    return Outer;
}(Hello);
expect(new Outer().hello()).toBe('hello');
