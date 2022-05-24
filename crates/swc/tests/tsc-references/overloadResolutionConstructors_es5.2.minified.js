import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var fn1, fn2, fn3, fn4, fn5, SomeBase = function() {
    "use strict";
    _class_call_check(this, SomeBase);
}, SomeDerived1 = function(SomeBase1) {
    "use strict";
    _inherits(SomeDerived1, SomeBase1);
    var _super = _create_super(SomeDerived1);
    function SomeDerived1() {
        return _class_call_check(this, SomeDerived1), _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase2) {
    "use strict";
    _inherits(SomeDerived2, SomeBase2);
    var _super = _create_super(SomeDerived2);
    function SomeDerived2() {
        return _class_call_check(this, SomeDerived2), _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase3) {
    "use strict";
    _inherits(SomeDerived3, SomeBase3);
    var _super = _create_super(SomeDerived3);
    function SomeDerived3() {
        return _class_call_check(this, SomeDerived3), _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
new fn1(void 0), new fn1({}), new fn2(0, void 0), new fn2(0, ""), new fn2("", 0), new fn2("", 0), new fn3(3), new fn3("", 3, ""), new fn3(5, 5, 5), new fn3(4), new fn3("", "", ""), new fn3("", "", 3), new fn3(), new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), new fn4(3, void 0), new fn4("", null), new fn4(null, null), new fn4(!0, null), new fn4(null, !0), new fn5(function(n) {
    return n.toFixed();
}), new fn5(function(n) {
    return n.substr(0);
});
