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
        _this = _call_super(this, Outer);
        var Inner = /*#__PURE__*/ function() {
            function Inner() {
                _class_call_check(this, Inner);
            }
            _create_class(Inner, [
                {
                    key: _this,
                    value: function() {
                        return 'hello';
                    }
                }
            ]);
            return Inner;
        }();
        return _possible_constructor_return(_this, new Inner());
    }
    return Outer;
}(Hello);
expect(new Outer().hello()).toBe('hello');
