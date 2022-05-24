import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// basic uses of specialized signatures without errors
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
}(Base);
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
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
    return x;
};
var c = new C("a");
var i;
var a;
c = i;
c = a;
i = a;
a = i;
var r1 = new C("hi");
var r2 = new i("bye");
var r3 = new a("hm");
