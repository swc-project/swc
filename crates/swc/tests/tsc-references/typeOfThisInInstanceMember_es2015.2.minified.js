var c, r = c.x;
c.x.x.x;
var r2 = c.y, r3 = c.foo();
[
    r,
    r2,
    r3
].forEach((x)=>{
    x.foo, x.x, x.y;
});
