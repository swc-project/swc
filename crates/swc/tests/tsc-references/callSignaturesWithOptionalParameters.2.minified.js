//// [callSignaturesWithOptionalParameters.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var c, i, a, f = function(x) {}, f2 = function(x, y) {};
f(1), f(), f2(1), f2(1, 2), c.foo(), c.foo(1), i(), i(1), i.foo(1), i.foo(1, 2), a(), a(1), a.foo(), a.foo(1);
var b_foo = function(x) {}, b_a = function(x, y) {}, b_b = function(x) {};
b_foo(), b_foo(1), b_a(1), b_a(1, 2), b_b(), b_b(1);
