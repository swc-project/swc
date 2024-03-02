var Hello = /*#__PURE__*/ function() {
    "use strict";
    function Hello() {
        _class_call_check(this, Hello);
    }
    _create_class(Hello, [
        {
            key: "toString",
            value: function toString() {
                return 'hello';
            }
        }
    ]);
    return Hello;
}();
var Outer = /*#__PURE__*/ function(Hello) {
    "use strict";
    _inherits(Outer, Hello);
    var _super = _create_super(Outer);
    function Outer() {
        _class_call_check(this, Outer);
        var _this = _super.call(this);
        var _super_toString = _get((_assert_this_initialized(_this), _get_prototype_of(Outer.prototype)), "toString", _this).call(_this);
        var Inner = function Inner() {
            _class_call_check(this, Inner);
            _define_property(this, _super_toString, 'hello');
        };
        return _possible_constructor_return(_this, new Inner());
    }
    return Outer;
}(Hello);
expect(new Outer().hello).toBe('hello');
