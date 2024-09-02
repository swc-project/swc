//// [overloadResolutionClassConstructors.ts]
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
var s = new fn2(0, '');
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
new fn2('', 0); // OK
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
new fn2('', 0); // OK
// Generic overloads with differing arity called without type arguments
var fn3 = function fn3() {
    "use strict";
    _class_call_check(this, fn3);
};
new fn3(3);
new fn3('', 3, '');
new fn3(5, 5, 5);
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
new fn3(4); // Error
new fn3('', '', ''); // Error
new fn3('', '', 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
new fn3(); // Error
// Generic overloads with constraints called with type arguments that satisfy the constraints
var fn4 = function fn4() {
    "use strict";
    _class_call_check(this, fn4);
};
new fn4('', 3);
new fn4(3, ''); // Error
new fn4('', 3); // Error
new fn4(3, ''); // Error
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
new fn4('', 3);
new fn4(3, ''); // Error
new fn4(3, undefined); // Error
new fn4('', null);
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
