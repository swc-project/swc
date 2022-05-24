import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var SomeBase = function() {
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
function fn2() {}
function fn4() {}
function fn5() {}
fn2(0, void 0), fn2(0, ""), fn2("", 0), fn2("", 0), fn4("", 3), fn4(3, ""), fn4("", 3), fn4(3, ""), fn4("", 3), fn4(3, ""), fn4(3, void 0), fn4("", null), fn4(null, null), fn4(!0, null), fn4(null, !0), fn5(function(n) {
    return n.toFixed();
}), fn5(function(n) {
    return n.substr(0);
});
