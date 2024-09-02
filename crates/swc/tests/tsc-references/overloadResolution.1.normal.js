//// [overloadResolution.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var SomeBase = function SomeBase() {
    "use strict";
    _class_call_check(this, SomeBase);
};
var SomeDerived1 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    function SomeDerived1() {
        _class_call_check(this, SomeDerived1);
        return _call_super(this, SomeDerived1, arguments);
    }
    return SomeDerived1;
}(SomeBase);
var SomeDerived2 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    function SomeDerived2() {
        _class_call_check(this, SomeDerived2);
        return _call_super(this, SomeDerived2, arguments);
    }
    return SomeDerived2;
}(SomeBase);
var SomeDerived3 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    function SomeDerived3() {
        _class_call_check(this, SomeDerived3);
        return _call_super(this, SomeDerived3, arguments);
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
var s = fn2(0, '');
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
fn2('', 0); // Error
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
fn2('', 0); // OK
function fn3() {
    return null;
}
var s = fn3(3);
var s = fn3('', 3, '');
var n = fn3(5, 5, 5);
var n;
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
var s = fn3(4);
var s = fn3('', '', '');
var n = fn3('', '', 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
fn3(); // Error
function fn4() {}
fn4('', 3);
fn4(3, ''); // Error
fn4('', 3); // Error
fn4(3, '');
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
fn4('', 3);
fn4(3, '');
fn4(3, undefined);
fn4('', null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
fn4(null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
fn4(true, null); // Error
fn4(null, true); // Error
function fn5() {
    return undefined;
}
var n = fn5(function(n) {
    return n.toFixed();
});
var s = fn5(function(n) {
    return n.substr(0);
});
