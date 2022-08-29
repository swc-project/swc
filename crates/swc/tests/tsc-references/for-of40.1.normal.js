//// [for-of40.ts]
var map = new Map([
    [
        "",
        true
    ]
]);
for (var [k = "", v = false] of map){
    k;
    v;
}
