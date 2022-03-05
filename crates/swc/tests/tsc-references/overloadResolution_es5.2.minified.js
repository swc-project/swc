import * as swcHelpers from "@swc/helpers";
var SomeBase = function() {
    "use strict";
    swcHelpers.classCallCheck(this, SomeBase);
}, SomeDerived1 = function(SomeBase1) {
    "use strict";
    swcHelpers.inherits(SomeDerived1, SomeBase1);
    var _super = swcHelpers.createSuper(SomeDerived1);
    function SomeDerived1() {
        return swcHelpers.classCallCheck(this, SomeDerived1), _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase2) {
    "use strict";
    swcHelpers.inherits(SomeDerived2, SomeBase2);
    var _super = swcHelpers.createSuper(SomeDerived2);
    function SomeDerived2() {
        return swcHelpers.classCallCheck(this, SomeDerived2), _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase3) {
    "use strict";
    swcHelpers.inherits(SomeDerived3, SomeBase3);
    var _super = swcHelpers.createSuper(SomeDerived3);
    function SomeDerived3() {
        return swcHelpers.classCallCheck(this, SomeDerived3), _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
function fn1() {
    return null;
}
function fn2() {}
function fn3() {
    return null;
}
function fn4() {}
function fn5() {}
fn1(void 0), fn1({}), fn2(0, void 0), fn2(0, ""), fn2("", 0), fn2("", 0), fn3(3), fn3("", 3, ""), fn3(5, 5, 5), fn3(4), fn3("", "", ""), fn3("", "", 3), fn3(), fn4("", 3), fn4(3, ""), fn4("", 3), fn4(3, ""), fn4("", 3), fn4(3, ""), fn4(3, void 0), fn4("", null), fn4(null, null), fn4(!0, null), fn4(null, !0), fn5(function(n) {
    return n.toFixed();
}), fn5(function(n) {
    return n.substr(0);
});
