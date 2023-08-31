//// [overloadResolutionConstructors.ts]
var fn1, fn2, fn3, fn4, fn5;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
new fn1(void 0), // No candidate overloads found
new fn1({}), new fn2(0, void 0), new fn2(0, ""), // Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
new fn2("", 0), // Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
new fn2("", 0), new fn3(3), new fn3("", 3, ""), new fn3(5, 5, 5), new fn3(4), new fn3("", "", ""), new fn3("", "", 3), // Generic overloads with differing arity called with type argument count that doesn't match any overload
new fn3(), new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), // Generic overloads with constraints called without type arguments but with types that satisfy the constraints
new fn4("", 3), new fn4(3, ""), new fn4(3, void 0), new fn4("", null), // Generic overloads with constraints called with type arguments that do not satisfy the constraints
new fn4(null, null), // Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
new fn4(!0, null), new fn4(null, !0), new fn5(function(n) {
    return n.toFixed();
}), new fn5(function(n) {
    return n.substr(0);
});
