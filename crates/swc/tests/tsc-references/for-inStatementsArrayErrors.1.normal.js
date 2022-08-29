//// [for-inStatementsArrayErrors.ts]
var a;
for(var x in a){
    var a1 = a[x + 1];
    var a2 = a[x - 1];
    if (x === 1) {}
    var a3 = x.unknownProperty;
}
var i;
for(var i in a){}
var j;
for(var j in a){}
