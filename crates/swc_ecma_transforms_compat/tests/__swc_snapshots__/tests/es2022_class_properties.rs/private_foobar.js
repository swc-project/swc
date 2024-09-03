var _scopedFunctionWithThis = /*#__PURE__*/ new WeakMap();
var Child = /*#__PURE__*/ function(Parent1) {
    "use strict";
    _inherits(Child, Parent1);
    function Child() {
        _class_call_check(this, Child);
        var _this;
        _this = _call_super(this, Child), _class_private_field_init(_this, _scopedFunctionWithThis, {
            writable: true,
            value: ()=>{
                _this.name = {};
            }
        });
        return _this;
    }
    return Child;
}(Parent);
