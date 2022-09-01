//// [implementingAnInterfaceExtendingClassWithProtecteds.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Foo) {
    "use strict";
    _inherits(Bar5, Foo);
    var _super = _create_super(Bar5);
    function Bar5() {
        return _class_call_check(this, Bar5), _super.apply(this, arguments);
    }
    return Bar5;
}(function Foo() {
    "use strict";
    _class_call_check(this, Foo);
});
