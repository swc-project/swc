import * as swcHelpers from "@swc/helpers";
var TargetHasOptional, SourceHasOptional, Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Derived) {
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
!function(TargetHasOptional) {
    var c, a, d, e, f;
    new Base(), c = d, c = e, c = f, c = a, a = d, a = e, a = f, a = c;
}(TargetHasOptional || (TargetHasOptional = {})), function(SourceHasOptional) {
    var c, a, d, e, f;
    new Base(), c = d, c = e, c = f, c = a, a = d, a = e, a = f, a = c;
}(SourceHasOptional || (SourceHasOptional = {}));
