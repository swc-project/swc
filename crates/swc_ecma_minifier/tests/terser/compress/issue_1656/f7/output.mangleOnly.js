var a = 100, b = 10;
function c() {
    var c = 5;
    while(((b = a) ? !a : ~a ? null : (b += a)) && --c > 0){}
}
c();
console.log(a, b);
