var _scopedFunctionWithThis = /*#__PURE__*/ new WeakMap();
var Child = /*#__PURE__*/ function(Parent1) {
    "use strict";
    _inherits(Child, Parent1);
    var _super = _create_super(Child);
    function Child() {
        _class_call_check(this, Child);
        var _this;
        _this = _super.call(this);
        _class_private_field_init(_assert_this_initialized(_this), _scopedFunctionWithThis, {
            writable: true,
            value: ()=>{
                _this.name = {};
            }
        });
        return _this;
    }
    return Child;
}(Parent);
