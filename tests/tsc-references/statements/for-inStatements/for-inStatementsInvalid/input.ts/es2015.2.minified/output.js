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
for(var x in fn());
for(var x in c || d);
for(var x in e ? c : d);
for(var x in c);
for(var x in d);
for(var x in d[x]);
for(var x in c[23]);
for(var x in (x)=>x
);
for(var x in function(x, y) {
    return x + y;
});
for(var x in i[42]);
