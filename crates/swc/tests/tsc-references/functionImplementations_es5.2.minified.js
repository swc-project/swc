import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function rec1() {
    return rec2();
}
function rec2() {
    return rec1();
}
function rec3() {
    return rec4();
}
function rec4() {
    return rec3();
}
rec1(), rec2(), rec3(), rec4();
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
new Base(), new Base();
var Derived2 = function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base), AnotherClass = function() {
    "use strict";
    _class_call_check(this, AnotherClass);
};
