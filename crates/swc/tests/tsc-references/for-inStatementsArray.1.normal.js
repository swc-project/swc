//// [for-inStatementsArray.ts]
var a;
var b;
for(var x in a){
    var a1 = a[x];
    var a2 = a[x];
    var a3 = a[+x];
    var b1 = b[x];
    var b2 = b[x];
    var b3 = b[+x];
}
for(var x1 in a){
    for(var y in a){
        for(var z in a){
            var a11 = a[x1];
            var a21 = a[y];
            var a31 = a[z];
        }
    }
}
var i;
var j;
for(i in a){
    for(j in b){
        var a12 = a[i];
        var a22 = a[j];
    }
}
var s;
for(var s in a){
    var a13 = a[s];
}
for(s in a){
    var a14 = a[s];
}
