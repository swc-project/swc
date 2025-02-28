function r() {
    var n = [
        1,
        2,
        3
    ];
    var r = 0;
    for(var o = 0; o < n.length; o++)r += n[o];
    return r;
}
function n() {
    var n = [
        1,
        2,
        3
    ];
    var r = 0;
    for(var o = 0, t = n.length; o < t; o++)r += n[o];
    return r;
}
function o() {
    var r = [
        1,
        2,
        3
    ];
    for(var n = 0; n < r.length; n++)r[n]++;
    return r[2];
}
console.log(r(), n(), o());
