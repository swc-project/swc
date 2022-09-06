var l = 100,
    n = 10;
function o() {
    var o = 5;
    while (((n = l) ? !l : ~l ? null : (n += l)) && --o > 0) {}
}
o();
console.log(l, n);
