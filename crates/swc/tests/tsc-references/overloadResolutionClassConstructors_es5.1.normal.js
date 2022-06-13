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
// Ambiguous call picks the first overload in declaration order
var fn1 = function fn1() {
    "use strict";
    _class_call_check(this, fn1);
};
new fn1(undefined);
// No candidate overloads found
new fn1({}); // Error
// Generic and non - generic overload where generic overload is the only candidate when called with type arguments
var fn2 = function fn2() {
    "use strict";
    _class_call_check(this, fn2);
};
var d = new fn2(0, undefined);
// Generic and non - generic overload where generic overload is the only candidate when called without type arguments
var s = new fn2(0, "");
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
new fn2("", 0); // OK
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
new fn2("", 0); // OK
// Generic overloads with differing arity called without type arguments
var fn3 = function fn3() {
    "use strict";
    _class_call_check(this, fn3);
};
new fn3(3);
new fn3("", 3, "");
new fn3(5, 5, 5);
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
new fn3(4); // Error
new fn3("", "", ""); // Error
new fn3("", "", 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
new fn3(); // Error
// Generic overloads with constraints called with type arguments that satisfy the constraints
var fn4 = function fn4() {
    "use strict";
    _class_call_check(this, fn4);
};
new fn4("", 3);
new fn4(3, ""); // Error
new fn4("", 3); // Error
new fn4(3, ""); // Error
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
new fn4("", 3);
new fn4(3, ""); // Error
new fn4(3, undefined); // Error
new fn4("", null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
new fn4(null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
new fn4(true, null); // Error
new fn4(null, true); // Error
// Non - generic overloads where contextual typing of function arguments has errors
var fn5 = function fn5() {
    "use strict";
    _class_call_check(this, fn5);
    return undefined;
};
new fn5(function(n) {
    return n.toFixed();
});
new fn5(function(n) {
    return n.substr(0);
});
new fn5(function(n) {
    return n.blah;
}); // Error
