//// [for-of45.ts]
var k, v;
var map = new Map([
    [
        "",
        true
    ]
]);
for ([k = "", v = false] of map){
    k;
    v;
}
