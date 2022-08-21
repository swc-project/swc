var c, i, a;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {}
function foo2(x, y) {}
foo(1), foo(), foo2(1), foo2(1, 2), c.foo(), c.foo(1), c.foo2(1), c.foo2(1, 2), i(), i(1), i(1, 2), i.foo(1), i.foo(1, 2), i.foo(1, 2, 3), a(), a(1), a(1, 2), a.foo(1), a.foo(1, 2), a.foo(1, 2, 3);
