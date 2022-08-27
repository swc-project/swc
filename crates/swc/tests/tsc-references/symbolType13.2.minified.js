//// [symbolType13.ts]
var x, s = Symbol();
for(s in {});
for(x in s);
for(var y in s);
