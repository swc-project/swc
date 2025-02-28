function o() {
    var l = 1, o = 2;
    o++;
    console.log(l + 1);
    console.log(o + 1);
}
function l() {
    var l = 1, o = 2;
    --o;
    console.log(l + 1);
    console.log(o + 1);
}
function n() {
    var n = 1, o = 2, l = 3;
    o = l;
    console.log(n + o);
    console.log(o + l);
    console.log(n + l);
    console.log(n + o + l);
}
function c() {
    var n = 1, o = 2, l = 3;
    o *= l;
    console.log(n + o);
    console.log(o + l);
    console.log(n + l);
    console.log(n + o + l);
}
function e() {
    var o = 1, l = 2, n = 3;
    if (o) {
        l = n;
    } else {
        n = l;
    }
    console.log(o + l);
    console.log(l + n);
    console.log(o + n);
    console.log(o + l + n);
}
function s(o) {
    B = o;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
o(), l(), n(), c(), e(), s();
