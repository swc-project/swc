import * as swcHelpers from "@swc/helpers";
var SomeBase = function SomeBase() {
    "use strict";
    swcHelpers.classCallCheck(this, SomeBase);
};
var SomeDerived1 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    swcHelpers.inherits(SomeDerived1, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived1);
    function SomeDerived1() {
        swcHelpers.classCallCheck(this, SomeDerived1);
        return _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase);
var SomeDerived2 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    swcHelpers.inherits(SomeDerived2, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived2);
    function SomeDerived2() {
        swcHelpers.classCallCheck(this, SomeDerived2);
        return _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase);
var SomeDerived3 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    swcHelpers.inherits(SomeDerived3, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived3);
    function SomeDerived3() {
        swcHelpers.classCallCheck(this, SomeDerived3);
        return _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
// Ambiguous call picks the first overload in declaration order
var fn1 = function fn1() {
    "use strict";
    swcHelpers.classCallCheck(this, fn1);
};
new fn1(undefined);
// No candidate overloads found
new fn1({}); // Error
// Generic and non - generic overload where generic overload is the only candidate when called with type arguments
var fn2 = function fn2() {
    "use strict";
    swcHelpers.classCallCheck(this, fn2);
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
    swcHelpers.classCallCheck(this, fn3);
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
    swcHelpers.classCallCheck(this, fn4);
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
    swcHelpers.classCallCheck(this, fn5);
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
