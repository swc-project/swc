var l = 100, n = 10;
function o() {
    var n = 5;
    while(((n = l) ? !l : ~l ? null : (n += l)) && --n > 0){}
}
o();
console.log(l, n);
