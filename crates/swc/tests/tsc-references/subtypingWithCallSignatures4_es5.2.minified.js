import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
}(Base), Derived2 = function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived), OtherDerived = function(Base2) {
    "use strict";
    _inherits(OtherDerived, Base2);
    var _super = _create_super(OtherDerived);
    function OtherDerived() {
        return _class_call_check(this, OtherDerived), _super.apply(this, arguments);
    }
    return OtherDerived;
}(Base);
foo1(function(x) {
    return null;
}), foo2(function(x) {
    return [
        ""
    ];
}), foo3(function(x) {
    return null;
}), foo4(function(x, y) {
    return "";
}), foo5(function(x) {
    return null;
}), foo6(function(x) {
    return null;
}), foo11(function(x, y) {
    return null;
}), foo15(function(x) {
    return null;
}), foo16(function(x) {
    return null;
}), foo17(function(x) {
    return null;
}), foo18(function(x) {
    return null;
});
