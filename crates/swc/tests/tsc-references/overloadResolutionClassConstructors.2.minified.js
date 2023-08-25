//// [overloadResolutionClassConstructors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
// Ambiguous call picks the first overload in declaration order
var fn1 = function fn1() {
    _class_call_check(this, fn1);
};
new fn1(void 0), // No candidate overloads found
new fn1({});
// Generic and non - generic overload where generic overload is the only candidate when called with type arguments
var fn2 = function fn2() {
    _class_call_check(this, fn2);
};
new fn2(0, void 0), new fn2(0, ""), // Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
new fn2("", 0), // Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
new fn2("", 0);
// Generic overloads with differing arity called without type arguments
var fn3 = function fn3() {
    _class_call_check(this, fn3);
};
new fn3(3), new fn3("", 3, ""), new fn3(5, 5, 5), // Generic overloads with differing arity called with type arguments matching each overload type parameter count
new fn3(4), new fn3("", "", ""), new fn3("", "", 3), // Generic overloads with differing arity called with type argument count that doesn't match any overload
new fn3();
// Generic overloads with constraints called with type arguments that satisfy the constraints
var fn4 = function fn4() {
    _class_call_check(this, fn4);
};
new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), // Generic overloads with constraints called without type arguments but with types that satisfy the constraints
new fn4("", 3), new fn4(3, ""), new fn4(3, void 0), new fn4("", null), // Generic overloads with constraints called with type arguments that do not satisfy the constraints
new fn4(null, null), // Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
new fn4(!0, null), new fn4(null, !0);
// Non - generic overloads where contextual typing of function arguments has errors
var fn5 = function fn5() {
    _class_call_check(this, fn5);
};
new fn5(function(n) {
    return n.toFixed();
}), new fn5(function(n) {
    return n.substr(0);
}), new fn5(function(n) {
    return n.blah;
});
 // Error
