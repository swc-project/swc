//// [for-inStatementsArrayErrors.ts]
for(var x in a){
    var a, i, j;
    a[x + 1], a[x - 1], x.unknownProperty;
}
for(var i in a);
for(var j in a);
