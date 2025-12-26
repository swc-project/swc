var _outer = new WeakMap();
var Outer = function Outer() {
    "use strict";
    _class_call_check(this, Outer);
    var _this = this;
    _class_private_field_init(this, _outer, {
        writable: true,
        value: void 0
    });
    var Test = /*#__PURE__*/ function(_superClass) {
        _inherits(Test, _superClass);
        function Test() {
            _class_call_check(this, Test);
            return _call_super(this, Test, arguments);
        }
        return Test;
    }(_this.#outer);
};
