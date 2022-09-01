//// [implementingAnInterfaceExtendingClassWithPrivates2.ts]
var M, M2;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        return _class_call_check(this, Bar), _super.apply(this, arguments);
    }
    return Bar;
}(function Foo() {
    "use strict";
    _class_call_check(this, Foo);
}), M || (M = {}), function(M2) {
    var b;
    b.z, b.x, b.y;
}(M2 || (M2 = {}));
