function r() {
    var r = [
        1,
        2,
        3
    ];
    var n = 0;
    for(var t = 0; t < r.length; t++)n += r[t];
    return n;
}
function n() {
    var r = [
        1,
        2,
        3
    ];
    var n = 0;
    for(var t = 0, a = r.length; t < a; t++)n += r[t];
    return n;
}
function t() {
    var r = [
        1,
        2,
        3
    ];
    for(var n = 0; n < r.length; n++)r[n]++;
    return r[2];
}
console.log(r(), n(), t());
