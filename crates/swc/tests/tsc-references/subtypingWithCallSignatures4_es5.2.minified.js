import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Derived) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived), OtherDerived = function(Base2) {
    "use strict";
    swcHelpers.inherits(OtherDerived, Base2);
    var _super = swcHelpers.createSuper(OtherDerived);
    function OtherDerived() {
        return swcHelpers.classCallCheck(this, OtherDerived), _super.apply(this, arguments);
    }
    return OtherDerived;
}(Base);
foo1(function(x) {
    return null;
}), foo2(function(x) {
    return [
        ''
    ];
}), foo3(function(x) {
    return null;
}), foo4(function(x, y) {
    return '';
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
