//// [typeOfThisInInstanceMember2.ts]
var c, r = c.x;
c.x.x.x;
var r2 = c.y, r3 = c.foo();
c.z, [
    r,
    r2,
    r3
].forEach(function(x) {
    x.foo, x.x, x.y, x.z;
});
