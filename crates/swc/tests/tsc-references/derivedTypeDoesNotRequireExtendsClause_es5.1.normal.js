import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = function Derived() {
    "use strict";
    _class_call_check(this, Derived);
};
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
var b;
var d1;
var d2;
b = d1;
b = d2;
var r = [
    d1,
    d2
];
