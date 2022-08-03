var n = 0, r = 1;
function t() {
    n = 2;
    return 4;
}
function u() {
    var u = t();
    r = n + u;
    return r;
}
console.log(u());
