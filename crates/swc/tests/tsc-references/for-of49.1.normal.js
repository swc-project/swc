//// [for-of49.ts]
var k, v;
var map = new Map([
    [
        "",
        true
    ]
]);
for ([k, ...[v]] of map){
    k;
    v;
}
