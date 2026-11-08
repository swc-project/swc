//// [callSignaturesWithOptionalParameters.ts]
import "@swc/helpers/_/_class_call_check";
var f = function(x) {}, f2 = function(x, y) {};
f(1), f(), f2(1), f2(1, 2), (void 0).foo(), (void 0).foo(1), (void 0)(), (void 0)(1), (void 0).foo(1), (void 0).foo(1, 2), (void 0)(), (void 0)(1), (void 0).foo(), (void 0).foo(1);
var b_foo = function(x) {}, b_a = function(x, y) {}, b_b = function(x) {};
b_foo(), b_foo(1), b_a(1), b_a(1, 2), b_b(), b_b(1);
