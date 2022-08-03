var n = 0;
function r(r) {
    n = 200;
    return 100;
}
function $() {
    var $ = r();
    n += $;
    return n;
}
console.log($());
