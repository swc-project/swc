let A = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(A, B);
    var _super = _create_super(A);
    function A() {
        _class_call_check(this, A);
        return _super.apply(this, arguments);
    }
    _create_class(A, [
        {
            key: "foo",
            value: function foo() {
                --_update(_get_prototype_of(A.prototype), baz, this, true)._;
            }
        }
    ]);
    return A;
}(B);
