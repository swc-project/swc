//// [for-inStatementsArrayErrors.ts]
for(var x in a)var a, i, j, a1 = a[x + 1], a2 = a[x - 1], a3 = x.unknownProperty;
for(var i in a);
for(var j in a);
