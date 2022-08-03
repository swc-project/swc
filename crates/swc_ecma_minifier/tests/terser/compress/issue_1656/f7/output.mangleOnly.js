var l = 100, $ = 10;
function n() {
    var n = 5;
    while((($ = l) ? !l : ~l ? null : ($ += l)) && --n > 0){}
}
n();
console.log(l, $);
