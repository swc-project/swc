var aString, anAny, c, d, e, i, M, M, Color;
for(aString in {
});
for(anAny in {
});
for(var x1 in {
});
for(var x1 in []);
for(var x1 in [
    1,
    2,
    3,
    4,
    5
]);
function fn() {
}
for(var x1 in fn());
for(var x1 in /[a-z]/);
for(var x1 in new Date());
for(var x1 in c || d);
for(var x1 in e ? c : d);
for(var x1 in c);
for(var x1 in d);
for(var x1 in d[x1]);
for(var x1 in c[d]);
for(var x1 in (x)=>x
);
for(var x1 in function(x, y) {
    return x + y;
});
for(var x1 in i[42]);
for(var x1 in (M = M || (M = {
})).X = class {
}, M);
for(var x1 in M.X);
let Color;
for(var x1 in (Color = Color || (Color = {
}))[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue", Color);
for(var x1 in Color.Blue);
