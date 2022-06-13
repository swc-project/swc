import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noImplicitOverride: true
// @target: esnext
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    this.property = 1;
};
var SubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(SubFoo, Foo);
    var _super = _create_super(SubFoo);
    function SubFoo() {
        _class_call_check(this, SubFoo);
        return _super.apply(this, arguments);
    }
    return SubFoo;
}(Foo);
