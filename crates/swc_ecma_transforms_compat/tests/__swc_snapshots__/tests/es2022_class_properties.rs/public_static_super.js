var _A;
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
_define_property(A, "prop", 1);
var B = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(B, _superClass);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    return B;
}(_A = A);
_define_property(B, "prop", 2);
_define_property(B, "propA", _A.prop);
_define_property(B, "getPropA", ()=>_A.prop);
