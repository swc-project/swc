//// [keyofAndForIn.ts]
// Repro from #12513
function f1(obj, k) {
    var b = k in obj;
    var k1;
    for(k1 in obj){
        var x1 = obj[k1];
    }
    for(var k2 in obj){
        var x2 = obj[k2];
    }
}
function f2(obj, k) {
    var b = k in obj;
    var k1;
    for(k1 in obj){
        var x1 = obj[k1];
    }
    for(var k2 in obj){
        var x2 = obj[k2];
    }
}
function f3(obj, k) {
    var b = k in obj;
    var k1;
    for(k1 in obj){
        var x1 = obj[k1];
    }
    for(var k2 in obj){
        var x2 = obj[k2];
    }
}
