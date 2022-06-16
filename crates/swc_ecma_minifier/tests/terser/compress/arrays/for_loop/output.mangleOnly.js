function a() {
    var a = [
        1,
        2,
        3
    ];
    var b = 0;
    for(var c = 0; c < a.length; c++)b += a[c];
    return b;
}
function b() {
    var a = [
        1,
        2,
        3
    ];
    var b = 0;
    for(var c = 0, d = a.length; c < d; c++)b += a[c];
    return b;
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
