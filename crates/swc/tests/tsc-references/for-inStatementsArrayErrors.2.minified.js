//// [for-inStatementsArrayErrors.ts]
var a;
for(var x in a)a[x + 1], a[x - 1], x.unknownProperty;
for(var i in a);
for(var j in a);
