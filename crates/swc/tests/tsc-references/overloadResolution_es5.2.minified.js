import * as swcHelpers from "@swc/helpers";
var SomeBase = function() {
    swcHelpers.classCallCheck(this, SomeBase);
}, SomeDerived1 = function(SomeBase1) {
    swcHelpers.inherits(SomeDerived1, SomeBase1);
    var _super = swcHelpers.createSuper(SomeDerived1);
    function SomeDerived1() {
        return swcHelpers.classCallCheck(this, SomeDerived1), _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase2) {
    swcHelpers.inherits(SomeDerived2, SomeBase2);
    var _super = swcHelpers.createSuper(SomeDerived2);
    function SomeDerived2() {
        return swcHelpers.classCallCheck(this, SomeDerived2), _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase3) {
    swcHelpers.inherits(SomeDerived3, SomeBase3);
    var _super = swcHelpers.createSuper(SomeDerived3);
    function SomeDerived3() {
        return swcHelpers.classCallCheck(this, SomeDerived3), _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
