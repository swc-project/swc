//// [overloadResolution.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var s, d, n, SomeBase = function SomeBase() {
    "use strict";
    _class_call_check(this, SomeBase);
}, SomeDerived1 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _create_super(SomeDerived1);
    function SomeDerived1() {
        return _class_call_check(this, SomeDerived1), _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _create_super(SomeDerived2);
    function SomeDerived2() {
        return _class_call_check(this, SomeDerived2), _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _create_super(SomeDerived3);
    function SomeDerived3() {
        return _class_call_check(this, SomeDerived3), _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
function fn1() {
    return null;
}
var s = fn1(void 0);
function fn2() {}
fn1({});
var d = fn2(0, void 0), s = fn2(0, "");
function fn3() {
    return null;
}
fn2("", 0), fn2("", 0);
var s = fn3(3), s = fn3("", 3, ""), n = fn3(5, 5, 5), s = fn3(4), s = fn3("", "", ""), n = fn3("", "", 3);
function fn4() {}
function fn5() {}
fn3(), fn4("", 3), fn4(3, ""), fn4("", 3), fn4(3, ""), fn4("", 3), fn4(3, ""), fn4(3, void 0), fn4("", null), fn4(null, null), fn4(!0, null), fn4(null, !0);
var n = fn5(function(n) {
    return n.toFixed();
}), s = fn5(function(n) {
    return n.substr(0);
});
