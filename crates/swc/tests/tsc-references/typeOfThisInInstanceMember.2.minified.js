//// [typeOfThisInInstanceMember.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var c, r = c.x;
c.x.x.x;
var r2 = c.y, r3 = c.foo();
[
    r,
    r2,
    r3
].forEach(function(x) {
    x.foo, x.x, x.y;
});
