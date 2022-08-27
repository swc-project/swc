//// [for-of46.ts]
var k, v;
var map = new Map([
    [
        "",
        true
    ]
]);
for ([k = false, v = ""] of map){
    k;
    v;
}
