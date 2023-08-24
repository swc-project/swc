//// [callSignaturesWithOptionalParameters2.ts]
// Optional parameters should be valid in all the below casts
var c, i, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
c.foo(), c.foo(1), c.foo2(1), c.foo2(1, 2), i(), i(1), i(1, 2), i.foo(1), i.foo(1, 2), i.foo(1, 2, 3), a(), a(1), a(1, 2), a.foo(1), a.foo(1, 2), a.foo(1, 2, 3);
