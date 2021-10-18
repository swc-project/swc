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
            var a1 = a[x1];
            var a2 = a[y];
            var a3 = a[z];
        }
    }
}
var i = void 0;
var j = void 0;
for(i in a){
    for(j in b){
        var a1 = a[i];
        var a2 = a[j];
    }
}
var s;
for(var s in a){
    var a1 = a[s];
}
for(s in a){
    var a1 = a[s];
}
