import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var SomeBase = function SomeBase() {
    "use strict";
    _class_call_check(this, SomeBase);
};
var SomeDerived1 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _create_super(SomeDerived1);
    function SomeDerived1() {
        _class_call_check(this, SomeDerived1);
        return _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase);
var SomeDerived2 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _create_super(SomeDerived2);
    function SomeDerived2() {
        _class_call_check(this, SomeDerived2);
        return _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase);
var SomeDerived3 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _create_super(SomeDerived3);
    function SomeDerived3() {
        _class_call_check(this, SomeDerived3);
        return _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
function fn1() {
    return null;
}
var s = fn1(undefined);
var s;
// No candidate overloads found
fn1({}); // Error
function fn2() {
    return undefined;
}
var d = fn2(0, undefined);
var d;
// Generic and non - generic overload where generic overload is the only candidate when called without type arguments
var s = fn2(0, "");
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
fn2("", 0); // Error
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
fn2("", 0); // OK
function fn3() {
    return null;
}
var s = fn3(3);
var s = fn3("", 3, "");
var n = fn3(5, 5, 5);
var n;
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
var s = fn3(4);
var s = fn3("", "", "");
var n = fn3("", "", 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
fn3(); // Error
function fn4() {}
fn4("", 3);
fn4(3, ""); // Error
fn4("", 3); // Error
fn4(3, "");
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
fn4("", 3);
fn4(3, "");
fn4(3, undefined);
fn4("", null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
fn4(null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
fn4(true, null); // Error
fn4(null, true); // Error
function fn5() {
    return undefined;
}
var n = fn5(function(n1) {
    return n1.toFixed();
});
var s = fn5(function(n2) {
    return n2.substr(0);
});
