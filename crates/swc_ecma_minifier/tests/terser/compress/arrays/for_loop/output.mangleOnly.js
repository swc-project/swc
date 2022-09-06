function r() {
    var r = [1, 2, 3];
    var n = 0;
    for (var o = 0; o < r.length; o++) n += r[o];
    return n;
}
function n() {
    var r = [1, 2, 3];
    var n = 0;
    for (var o = 0, t = r.length; o < t; o++) n += r[o];
    return n;
}
function o() {
    var r = [1, 2, 3];
    for (var n = 0; n < r.length; n++) r[n]++;
    return r[2];
}
console.log(r(), n(), o());
