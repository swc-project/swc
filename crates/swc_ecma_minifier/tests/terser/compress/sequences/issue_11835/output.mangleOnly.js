var n, r;
function o() {
    n = 100;
    return [
        1,
        2,
        3
    ];
}
function t() {
    var t = 0;
    r = o();
    for(n = 1; n <= r.length; n++){
        t++;
    }
    return t;
}
console.log(t());
