var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
_define_property(A, "prop", 1);
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
_define_property(B, "prop", 2);
_define_property(B, "propA", _get(_get_prototype_of(B), "prop", B));
_define_property(B, "getPropA", ()=>_get(_get_prototype_of(B), "prop", B));
