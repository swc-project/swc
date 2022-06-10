function a() {
    var b = [
        1,
        2,
        3
    ];
    var c = 0;
    for(var a = 0; a < b.length; a++)c += b[a];
    return c;
}
function b() {
    var b = [
        1,
        2,
        3
    ];
    var c = 0;
    for(var a = 0, d = b.length; a < d; a++)c += b[a];
    return c;
}
function c() {
    var a = [
        1,
        2,
        3
    ];
    for(var b = 0; b < a.length; b++)a[b]++;
    return a[2];
}
console.log(a(), b(), c());
