import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
