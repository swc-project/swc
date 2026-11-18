let Outer = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(Outer, B);
    function Outer() {
        _class_call_check(this, Outer);
        var _this;
        let Inner = /*#__PURE__*/ function() {
            function Inner() {
                _class_call_check(this, Inner);
            }
            _create_class(Inner, [
                {
                    key: _assert_this_initialized(_this),
                    value: function() {
                        return 'hello';
                    }
                }
            ]);
            return Inner;
        }();
        function foo() {
            return this;
        }
        return _possible_constructor_return(_this, new Inner());
    }
    return Outer;
}(B);
