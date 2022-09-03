//// [keyofAndForIn.ts]
function f1(obj, k) {
    var k1;
    for(k1 in obj)obj[k1];
    for(var k2 in obj)obj[k2];
}
function f2(obj, k) {
    var k1;
    for(k1 in obj)obj[k1];
    for(var k2 in obj)obj[k2];
}
function f3(obj, k) {
    var k1;
    for(k1 in obj)obj[k1];
    for(var k2 in obj)obj[k2];
}
