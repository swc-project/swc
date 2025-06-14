//// [typeOfThisInInstanceMember.ts]
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_create_class";
var c, r = c.x;
c.x.x.x, [
    r,
    c.y,
    c.foo()
].forEach(function(x) {
    x.foo, x.x, x.y;
});
