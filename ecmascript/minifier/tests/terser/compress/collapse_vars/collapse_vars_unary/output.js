function f0(o, p) {
    var x = o[p];
    return delete x;
}
function f1(n) {
    return n > +!!n;
}
function f2(n) {
    var k = 7;
    return k--;
}
function f3(n) {
    var k = 7;
    return ++k;
}
function f4(n) {
    var k = 8 - n;
    return k--;
}
function f5(n) {
    var k = 9 - n;
    return ++k;
}
