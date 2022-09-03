//// [derivedTypeDoesNotRequireExtendsClause.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var b, d1, d2, Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function Derived() {
    "use strict";
    _class_call_check(this, Derived);
}, Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
b = d1, b = d2;
var r = [
    d1,
    d2
];
