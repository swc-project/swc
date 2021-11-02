var aNumber, aBoolean, aRegExp, c, d, e, i;
for(aNumber in {
});
for(aBoolean in {
});
for(aRegExp in {
});
for(var idx in {
});
function fn() {
}
for(var x1 in fn());
for(var x1 in c || d);
for(var x1 in e ? c : d);
for(var x1 in c);
for(var x1 in d);
for(var x1 in d[x1]);
for(var x1 in c[23]);
for(var x1 in (x)=>x
);
for(var x1 in function(x, y) {
    return x + y;
});
for(var x1 in i[42]);
